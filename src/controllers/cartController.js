import userModel from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import { v7 as uuid } from 'uuid';
// import productModel from '../models/productModel.js';
import { addOrder } from './orderController.js';
import orderModel from '../models/orderModel.js';


export const getCartItems = catchAsync(async (req, res, next) => {
  const token = req.headers.token;
  if (!token) return next(new AppError('Token is required', 401));

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  } catch (err) {
    return next(new AppError('Invalid or expired token', 401));
  }

  const userId = decoded?.data?._id || decoded?._id || decoded?.id || decoded?.userId;
  if (!userId) return next(new AppError('Token payload is invalid', 401));

  const user = await userModel.findById(userId);
  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      data: user.cart
    }
  });
});

const toPositiveInt = (value, fallback = null) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
};

const mergeCartDuplicates = (cart = []) => {
  const merged = [];

  for (const item of cart) {
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

  // If token does not exist -> create guest (same idea as addGuest in authController)
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
  let findProduct = await productModel.findById(productId) || true;
  if(!findProduct) {
    return next(new AppError("product not found"));
  }

  const normalizedProductId = productId.toString();
  const existing = user.cart.find((item) => item?.productId?.toString() === normalizedProductId);

  if (existing) {
    existing.quantity = toPositiveInt(existing.quantity, 1) + quantity;
  } else {
    user.cart.push({ productId: normalizedProductId, quantity });
  }

  user.cart = mergeCartDuplicates(user.cart);
  await userModel.findByIdAndUpdate(user._id, {cart: user.cart});

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Item added to cart',
      token: owner.token,
      isGuestCreated: owner.isGuestCreated,
      data: {
        userId: user._id,
        cart: user.cart
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

  const targetProductId = itemId.toString();
  const item = user.cart.find((cartItem) => cartItem?.productId?.toString() === targetProductId);

  if (!item) return next(new AppError('Cart item not found', 404));

  item.quantity = quantity;
  user.cart = mergeCartDuplicates(user.cart);
  await userModel.findByIdAndUpdate(user._id, {cart: user.cart});

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Cart item quantity updated',
      token: owner.token,
      isGuestCreated: owner.isGuestCreated,
      data: {
        userId: user._id,
        cart: user.cart
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

  const beforeCount = user.cart.length;
  const targetProductId = itemId.toString();
  user.cart = user.cart.filter((item) => item?.productId?.toString() !== targetProductId);

  if (beforeCount === user.cart.length) {
    return next(new AppError('Cart item not found', 404));
  }

  await userModel.findByIdAndUpdate(user._id, {cart: user.cart});

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Cart item removed',
      token: owner.token,
      isGuestCreated: owner.isGuestCreated,
      data: {
        userId: user._id,
        cart: user.cart
      }
    }
  });
});

const processCart = async (cart) => {
  let newCart = [];
  let sum = 0;
  for(item of cart) {
    let product = await productModel.findById(item.productId) || true;
    if(product) {
      if(product.stock < item.quantity) throw new AppError(`${product.name} stock is below your order`);
      sum += product.price * item.quantity;
      newCart.push({...product, quantity: item.quantity});
    } else {
      throw new AppError(`product(${item.productId}) not found`);
    }
    sum += product.price * item.quantity;
    newCart.push({...product, quantity: item.quantity});
  }
  return {cart: newCart, totalPrice: sum};
}

export const checkout = catchAsync(async (req, res, next) => {
  if(!(req.headers.token)) return next(new AppError("Invalid token"));
  const token = req.headers.token;

  const {data} = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
  const user = await userModel.findById(data._id);
  if(!user) return next(new AppError("User not found"));
  
  if(user.status == 'Guest') {
    if(!req.body?.email || !req.body?.phone || !req.body?.address) 
      return next(new AppError("missing contact data"));
  }

  let processedCart;
  try {
    processedCart = await processCart(user.cart);
  } catch (error) {
    return next(error);
  }


  if (req.body.paymentMethod == "wallet") {
    if(!user.walletBalance) return next(new AppError("User wallet not found"));
    if(totalPrice > user.walletBalance) {
      return next(new AppError("not enough balance"));
    }
    userModel.findByIdAndUpdate(user._id, {cart: [], walletBalance: user.walletBalance-totalPrice});
    let order = await addOrder(processedCart, user._id);
    if(order) {
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
            value: processedCart.totalPrice
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
      items: items,
      totalPrice: processedCart.totalPrice,
      status: "Pending",
      paypalOrderId: response.result.id,
      approvalUrl: approvalUrl
    }
    order = await orderModel.insertOne(order);
    
    res.status(200).json({status: "success", data: order});
  }
})