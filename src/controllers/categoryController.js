import Category from "../models/categoryModel.js";

export const getAllCategories = async (req, res) => {
  const categories = await Category.find();
  res.status(200).json({ status: "success", data: categories });
};

export const createCategory = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ status: "success", data: category });
};

export const getCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ status: "fail", message: "Category not found" });
  }
  res.status(200).json({ status: "success", data: category });
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) {
    return res.status(404).json({ status: "fail", message: "Category not found" });
  }
  res.status(200).json({ status: "success", data: category });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ status: "fail", message: "Category not found" });
  }
  res.status(204).json({ status: "success", data: null });
};
