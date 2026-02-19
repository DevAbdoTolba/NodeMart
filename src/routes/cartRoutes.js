import express from 'express';
import {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem
} from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.post('/api/cart', addItemToCart);
cartRouter.patch('/api/cart/:itemId', updateCartItemQuantity);
cartRouter.delete('/api/cart/:itemId', deleteCartItem);

export default cartRouter;
