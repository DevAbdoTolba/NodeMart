import Product from '../models/productModel.js';
import * as factory from '../utils/handlerFactory.js'; // صححت المسار

export const createProduct = factory.createOne(Product);
export const getProduct = factory.getOne(Product, 'category'); // populate category
export const getAllProducts = factory.getAll(Product);
export const updateProduct = factory.updateOne(Product);
export const deleteProduct = factory.deleteOne(Product);
