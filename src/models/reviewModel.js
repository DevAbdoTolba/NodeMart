import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Review title is required"],
      trim: true,
    },
    review: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
    },
    ratings: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
