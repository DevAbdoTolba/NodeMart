import Product from "../models/productModel.js";

export const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json({ status: "success", data: products });
};

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ status: "success", data: product });
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) {
    return res.status(404).json({ status: "fail", message: "Product not found" });
  }

  res.status(200).json({ status: "success", data: product });
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!product) {
    return res.status(404).json({ status: "fail", message: "Product not found" });
  }
  res.status(200).json({ status: "success", data: product });
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ status: "fail", message: "Product not found" });
  }
  res.status(204).json({ status: "success", data: null });
};
