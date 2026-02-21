import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  ratingsAverage: { type: Number, default: 0 },
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
