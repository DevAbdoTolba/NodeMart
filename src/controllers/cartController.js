import userModel from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import jwt from 'jsonwebtoken';
import { v7 as uuid } from 'uuid';


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
  if (!owner?.user) return;
  const user = owner.user;

  const { productId } = req.body;
  const quantity = toPositiveInt(req.body.quantity, null);

  if (!productId) return next(new AppError('productId is required', 400));
  if (!quantity) return next(new AppError('quantity must be a positive number', 400));

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
  if (!owner?.user) return;
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
  if (!owner?.user) return;
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
