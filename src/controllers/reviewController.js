import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const createReview = catchAsync(async (req, res, next) => {
  const { product, ratings, review, title } = req.body;
  const user = req.user._id;

  const existingProduct = await Product.findById(product);
  if (!existingProduct) {
    return next(new AppError("Product not found", 404));
  }

  const newReview = await Review.create({ title, review, ratings, product, user });

  // Update product's average rating
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

export const getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find().populate("user", "name").populate("product", "name");
  res.status(200).json({ status: "success", results: reviews.length, data: reviews });
});

export const getReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id)
    .populate("user", "name")
    .populate("product", "name");
  if (!review) return next(new AppError("Review not found", 404));
  res.status(200).json({ status: "success", data: review });
});

export const deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return next(new AppError("Review not found", 404));

  // Update product rating
  const reviews = await Review.find({ product: review.product });
  const avgRating = reviews.length
    ? reviews.reduce((acc, r) => acc + r.ratings, 0) / reviews.length
    : 0;
  await Product.findByIdAndUpdate(review.product, { ratingsAverage: avgRating });

  res.status(204).json({ status: "success" });
});
