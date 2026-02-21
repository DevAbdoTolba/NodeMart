import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import AppError from "../utils/appError.js";

export async function createReview(req, res, next) {
  try {
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
  } catch (err) {
    if (err.code === 11000) {
      return next(new AppError("You already reviewed this product", 400));
    }
    next(err);
  }
}

export async function getAllReviews(req, res, next) {
  try {
    const reviews = await Review.find().populate("user", "name").populate("product", "name");
    res.status(200).json({ status: "success", results: reviews.length, data: reviews });
  } catch (err) {
    next(err);
  }
}

export async function getReview(req, res, next) {
  try {
    const review = await Review.findById(req.params.id)
      .populate("user", "name")
      .populate("product", "name");
    if (!review) return next(new AppError("Review not found", 404));
    res.status(200).json({ status: "success", data: review });
  } catch (err) {
    next(err);
  }
}

export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return next(new AppError("Review not found", 404));

    // Update product rating
    const reviews = await Review.find({ product: review.product });
    const avgRating = reviews.length
      ? reviews.reduce((acc, r) => acc + r.ratings, 0) / reviews.length
      : 0;
    await Product.findByIdAndUpdate(review.product, { ratingsAverage: avgRating });

    res.status(204).json({ status: "success" });
  } catch (err) {
    next(err);
  }
}
