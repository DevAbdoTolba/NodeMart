import express from 'express';
import {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItems,
  checkout
} from '../controllers/cartController.js';
import {approvePayment} from '../utils/paymentSetup.js';

const cartRouter = express.Router();

cartRouter.get('/api/cart', getCartItems)
cartRouter.post('/api/cart', addItemToCart);
cartRouter.post('/api/checkout', checkout);
cartRouter.patch('/api/cart/:itemId', updateCartItemQuantity);
cartRouter.delete('/api/cart/:itemId', deleteCartItem);
cartRouter.post("/api/payments/paypal/webhook", approvePayment);

export default cartRouter;
