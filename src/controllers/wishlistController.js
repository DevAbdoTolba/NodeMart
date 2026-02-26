import wishlistModel from '../models/wishlistModel.js';
import productModel from '../models/productModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

// Helper: get or create a wishlist document for a user
const getOrCreateWishlist = async (userId) => {
  let wishlist = await wishlistModel.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await wishlistModel.create({ user: userId, items: [] });
  }
  return wishlist;
};

// GET all wishlist items
export const getWishlistItems = catchAsync(async (req, res, next) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  await wishlist.populate('items.productId');
  res.status(200).json({
    status: 'success',
    results: wishlist.items.length,
    data: {
      data: wishlist.items
    }
  });
});

// POST add item to wishlist
export const addItemToWishlist = catchAsync(async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) return next(new AppError('productId is required', 400));

  const product = await productModel.findById(productId);
  if (!product) return next(new AppError('Product not found', 404));

  const wishlist = await getOrCreateWishlist(req.user._id);

  const normalizedProductId = productId.toString();
  const alreadyExists = wishlist.items.find(
    (item) => item?.productId?.toString() === normalizedProductId
  );

  if (alreadyExists) {
    return next(new AppError('Product already in wishlist', 400));
  }

  wishlist.items.push({ productId: normalizedProductId });
  await wishlistModel.findByIdAndUpdate(wishlist._id, { items: wishlist.items });

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Product added to wishlist',
      data: wishlist.items
    }
  });
});

// DELETE remove item from wishlist
export const deleteWishlistItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;

  if (!itemId) return next(new AppError('itemId is required', 400));

  const wishlist = await getOrCreateWishlist(req.user._id);

  const beforeCount = wishlist.items.length;
  const targetProductId = itemId.toString();
  wishlist.items = wishlist.items.filter(
    (item) => item?.productId?.toString() !== targetProductId
  );

  if (beforeCount === wishlist.items.length) {
    return next(new AppError('Wishlist item not found', 404));
  }

  await wishlistModel.findByIdAndUpdate(wishlist._id, { items: wishlist.items });

  res.status(200).json({
    status: 'success',
    data: {
      message: 'Product removed from wishlist',
      data: wishlist.items
    }
  });
});
