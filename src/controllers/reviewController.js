import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createReview = catchAsync(async (req, res, next) => {
  const { product, ratings, review, title } = req.body;
  const user = req.user._id;

  const existingProduct = await Product.findById(product);
  if (!existingProduct) {
    return next(new AppError("Product not found", 404));
  }

  const existingReview = await Review.findOne({ user, product });
  if (existingReview) {
    return next(new AppError("You already reviewed this product", 400));
  }

  const order = await Order.findOne({
    user,
    paymentStatus: "Completed",
    "items.product": product
  });
  if (!order) {
    return next(new AppError("You can only review products you have purchased", 403));
  }

  const newReview = await Review.create({ title, review, ratings, product, user });

  const reviews = await Review.find({ product });
  const avgRating = reviews.reduce((acc, r) => acc + r.ratings, 0) / reviews.length;
  await Product.findByIdAndUpdate(product, { ratingsAverage: avgRating });

  res.status(201).json({
    status: "success",
    data: {
      data: newReview,
    },
  });
});

export const getReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name")
    .populate("product", "name");
  const avgRating = reviews.reduce((acc, r) => acc + r.ratings, 0) / reviews.length;
  res.status(200).json({ status: "success", results: reviews.length, data: reviews, ratingsAverage: avgRating.toFixed(1) });
});

export const updateReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("Review not found", 404));

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new AppError("You can only update your own reviews", 403));
  }

  const { title, review: reviewText, ratings } = req.body;
  if (title) review.title = title;
  if (reviewText) review.review = reviewText;
  if (ratings) review.ratings = ratings;
  await review.save();

  const reviews = await Review.find({ product: review.product });
  const avgRating = reviews.reduce((acc, r) => acc + r.ratings, 0) / reviews.length;
  await Product.findByIdAndUpdate(review.product, { ratingsAverage: avgRating });

  res.status(200).json({ status: "success", data: { data: review } });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("Review not found", 404));

  if (review.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return next(new AppError("You can only delete your own reviews", 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  const reviews = await Review.find({ product: review.product });
  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.ratings, 0) / reviews.length
    : 0;
  await Product.findByIdAndUpdate(review.product, { ratingsAverage: avgRating });

  res.status(204).json({ status: "success" });
});
