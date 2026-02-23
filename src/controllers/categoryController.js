import Category from "../models/categoryModel.js";
import AppError from "../utils/appError.js";
import * as factory from "./handlerFactory.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const getAllCategories = factory.getAll(Category);
export const getCategory = factory.getOne(Category);
export const createCategory = async (req, res, next) => {
    const findCategory = await Category.findOne({name: req.body.name});
    if(findCategory) return next(new AppError("category already exists"));
    return factory.createOne(Category)(req, res, next);
}
export const updateCategory = factory.updateOne(Category);
export const deleteCategory = factory.deleteOne(Category);
