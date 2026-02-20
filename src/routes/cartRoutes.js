import express from 'express';
import {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItems
} from '../controllers/cartController.js';

const cartRouter = express.Router();

cartRouter.get('/api/cart', getCartItems)
cartRouter.post('/api/cart', addItemToCart);
cartRouter.patch('/api/cart/:itemId', updateCartItemQuantity);
cartRouter.delete('/api/cart/:itemId', deleteCartItem);

export default cartRouter;
