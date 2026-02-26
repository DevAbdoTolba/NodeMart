import userModel from '../models/userModel.js';
import cartModel from '../models/cartModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import { v7 as uuid } from 'uuid';
import paypal from '@paypal/checkout-server-sdk';
import { client } from '../utils/paymentSetup.js';
import productModel from '../models/productModel.js';
import { addOrder } from './orderController.js';
import orderModel from '../models/orderModel.js';

// Helper: get or create a cart document for a user
const getOrCreateCart = async (userId) => {
  let cart = await cartModel.findOne({ user: userId });
  if (!cart) {
    cart = await cartModel.create({ user: userId, items: [] });
  }
  return cart;
};

export const getCartItems = catchAsync(async (req, res, next) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate('items.productId');
  res.status(200).json({
    status: 'success',
    data: {
      data: cart.items
    }
  });
});

const toPositiveInt = (value, fallback = null) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const mergeCartDuplicates = (items = []) => {
  const merged = [];

  for (const item of items) {
    const productId = item?.productId?.toString();
    const quantity = toPositiveInt(item?.quantity, 1);

    if (!productId) continue;

    const existing = merged.find((cartItem) => cartItem.productId.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      merged.push({ productId, quantity });
    }
  }

  return merged;
};

const resolveCartOwner = async (req, next) => {
  const token = req.headers.token;

  if (!token) {
    const guest = await userModel.create({
      email: uuid(),
      status: 'Guest'
    });

    const guestToken = jwt.sign({ data: guest }, process.env.TOKEN_SECRET_KEY);
    return { user: guest, token: guestToken, isGuestCreated: true };
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  } catch (error) {
    return next(new AppError('Invalid token', 401));
  }

  const userId =
    decoded?.data?._id ||
    decoded?._id ||
    decoded?.id ||
    decoded?.userId;

  if (!userId) return next(new AppError('Token payload is invalid', 401));

  const user = await userModel.findById(userId);
  if (!user) return next(new AppError('User not found', 404));

  return { user, token, isGuestCreated: false };
};

export const addItemToCart = catchAsync(async (req, res, next) => {
  const owner = await resolveCartOwner(req, next);
  if (!owner?.user) return next(new AppError("user not found"));
  const user = owner.user;

  const { productId } = req.body;
  const quantity = toPositiveInt(req.body.quantity, null);

  if (!productId) return next(new AppError('productId is required', 400));
  if (!quantity) return next(new AppError('quantity must be a positive number', 400));
  let findProduct = await productModel.findById(productId);
  if(!findProduct) {
    return next(new AppError("product not found", 404));
  }

  const cart = await getOrCreateCart(user._id);

  const normalizedProductId = productId.toString();
  const existing = cart.items.find((item) => item?.productId?.toString() === normalizedProductId);

  const totalQuantity = existing ? toPositiveInt(existing.quantity, 1) + quantity : quantity;
  if(findProduct.stock < totalQuantity) {
    const avilableQuantity = existing ? findProduct.stock - existing?.quantity : findProduct.stock;
    return next(new AppError(`Not enough stock. ${avilableQuantity ? `Only ${avilableQuantity} available for you` : 'out of stock'}`, 400));
  }

  const totalQuantity = existing ? toPositiveInt(existing.quantity, 1) + quantity : quantity;
  if(findProduct.stock < totalQuantity) {
    const avilableQuantity = existing ? findProduct.stock - existing?.quantity : findProduct.stock;
    return next(new AppError(`Not enough stock. ${avilableQuantity ? `Only ${avilableQuantity} available for you` : 'out of stock'}`, 400));
  }

  if (existing) {
    existing.quantity = totalQuantity;
  } else {
    cart.items.push({ productId: normalizedProductId, quantity });
  }

  cart.items = mergeCartDuplicates(cart.items);
  await cartModel.findByIdAndUpdate(cart._id, { items: cart.items });

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Item added to cart',
      token: owner.token,
      isGuestCreated: owner.isGuestCreated,
      data: {
        cart: cart.items
      }
    }
  });
});

export const updateCartItemQuantity = catchAsync(async (req, res, next) => {
  const owner = await resolveCartOwner(req, next);
  if (!owner?.user) return next(new AppError("user not found"));
  const user = owner.user;

  const { itemId } = req.params;
  const quantity = toPositiveInt(req.body.quantity, null);

  if (!itemId) return next(new AppError('itemId is required', 400));
  if (!quantity) return next(new AppError('quantity must be a positive number', 400));

  const cart = await getOrCreateCart(user._id);

  const targetProductId = itemId.toString();
  const item = cart.items.find((cartItem) => cartItem?.productId?.toString() === targetProductId);

  if (!item) return next(new AppError('Cart item not found', 404));

  let product = await productModel.findById(targetProductId);
  if(!product) return next(new AppError("product not found", 404));
  if(product.stock < quantity) {
    return next(new AppError(`Not enough stock. Only ${product.stock} available`, 400));
  }

  item.quantity = quantity;
  cart.items = mergeCartDuplicates(cart.items);
  await cartModel.findByIdAndUpdate(cart._id, { items: cart.items });

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Cart item quantity updated',
      isGuestCreated: owner.isGuestCreated,
      data: {
        cart: cart.items
      }
    }
  });
});

export const deleteCartItem = catchAsync(async (req, res, next) => {
  const owner = await resolveCartOwner(req, next);
  if (!owner?.user) return next(new AppError("user not found"));
  const user = owner.user;

  const { itemId } = req.params;

  if (!itemId) return next(new AppError('itemId is required', 400));

  const cart = await getOrCreateCart(user._id);

  const beforeCount = cart.items.length;
  const targetProductId = itemId.toString();
  cart.items = cart.items.filter((item) => item?.productId?.toString() !== targetProductId);

  if (beforeCount === cart.items.length) {
    return next(new AppError('Cart item not found', 404));
  }

  await cartModel.findByIdAndUpdate(cart._id, { items: cart.items });

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Cart item removed',
      isGuestCreated: owner.isGuestCreated,
      data: {
        cart: cart.items
      }
    }
  });
});

const processCart = async (items) => {
  let newCart = [];
  let sum = 0;
  for(let item of items) {
    let product = await productModel.findById(item.productId);
    if(product) {
      if(product.stock < item.quantity) throw new AppError(`${product.name} stock is below your order`);
      sum += product.price * item.quantity;
      newCart.push({...product.toObject(), quantity: item.quantity});
    } else {
      throw new AppError(`product(${item.productId}) not found`);
    }
  }
  return {cart: newCart, totalPrice: sum};
}

export const checkout = catchAsync(async (req, res, next) => {
  if(!(req.headers.token)) return next(new AppError("Invalid token"));
  const token = req.headers.token;

  const {data} = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  const user = await userModel.findById(data._id);
  if(!user) return next(new AppError("User not found"));

  const cart = await getOrCreateCart(user._id);

  let processedCart;
  try {
    processedCart = await processCart(cart.items);
  } catch (error) {
    return next(error);
  }

  if (req.body.paymentMethod == "wallet") {
    if (user.walletBalance == null) return next(new AppError("User wallet not found"));
    
    if(processedCart.totalPrice > user.walletBalance) { 
      return next(new AppError("not enough balance"));
    }
    await userModel.findByIdAndUpdate(
      user._id,
      { walletBalance: user.walletBalance - processedCart.totalPrice }
    );
    await cartModel.findByIdAndUpdate(cart._id, { items: [] });

    let order = await addOrder(processedCart, user._id);
    if(order) {
      for(let item of order.items) {
        await productModel.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
      return res.status(200).json({status: "success", data: order});
    } else {
      return next(new AppError("order failed"));
    }
  } else if (req.body.paymentMethod == "COD") {
    await cartModel.findByIdAndUpdate(cart._id, { items: [] });

    let order = await addOrder(processedCart, user._id, true);
    if(order) {
      for(let item of order.items) {
        await productModel.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      }
      return res.status(200).json({status: "success", data: order});
    } else {
      return next(new AppError("order failed"));
    }
  } else if(req.body.paymentMethod == "paypal") {
    let items = [];
    for(let item of processedCart.cart) {
      items.push({
        product: item._id, 
        quantity: item.quantity, 
        price: item.price
      });
    }
    
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer("return=representation")
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: processedCart.totalPrice.toFixed(2)
          }
        }
      ]
    })
    
    const response = await client.execute(request)
    
    const approvalUrl = response.result.links.find(
      link => link.rel === "approve"
    ).href
    
    let order = {
      user: user._id,
      type: "order",
      items: items,
      totalPrice: processedCart.totalPrice,
      paypalOrderId: response.result.id
    }
    order = await orderModel.create(order);
    
    res.status(200).json({status: "success", data: order, approvalUrl: approvalUrl});
  } else {
    return res.status(400).json({
      status: "fail",
      message: "Invalid payment method. Supported methods are 'wallet', 'paypal', and 'COD'."
    });
  }
})


export const chargeWallet = async (req, res, next) => {
  if(!(req.headers.token)) return next(new AppError("Invalid token"));
  const token = req.headers.token;

  const {data} = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  const user = await userModel.findById(data._id);
  if(!user) return next(new AppError("User not found"));
  const request = new paypal.orders.OrdersCreateRequest()
  request.prefer("return=representation")
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: req.body.amount
        }
      }
    ]
  })
  
  const response = await client.execute(request)
  
  const approvalUrl = response.result.links.find(
    link => link.rel === "approve"
  ).href
  
  let order = {
    user: user._id,
    type: "walletCharge",
    totalPrice: req.body.amount,
    paypalOrderId: response.result.id
  }
  order = await orderModel.create(order);
  
  if(order)
    res.status(200).json({status: "success", data: order, approvalUrl: approvalUrl});
    else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid payment method. Supported methods are 'wallet', 'paypal', and 'COD'."
    });
  }
}