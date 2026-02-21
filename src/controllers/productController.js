import Product from "../models/productModel.js";
import * as factory from "./handlerFactory.js";

export const getAllProducts = factory.getAll(Product);
export const getProduct = factory.getOne(Product, "category");
export const createProduct = factory.createOne(Product);
export const updateProduct = factory.updateOne(Product);
export const deleteProduct = factory.deleteOne(Product);
