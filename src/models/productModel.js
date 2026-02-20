import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number,
  image: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
}, { timestamps: true });

export default mongoose.model("Product", productSchema);
