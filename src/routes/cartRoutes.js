import express from 'express';
import {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItems,
  checkout
} from '../controllers/cartController.js';
import {approvePayment} from '../utils/paymentSetup.js';
import { validateAddToCart, validateUpdateCart, validateCheckout, validateId } from '../middlewares/validationMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const cartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart management
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get cart items for the logged-in user
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart items retrieved
 *       401:
 *         description: Token missing or invalid
 */
cartRouter.get('/', protect, getCartItems)

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         description: JWT token (optional - creates guest if missing)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Missing productId or invalid quantity
 */
cartRouter.post('/', validateAddToCart, addItemToCart);

/**
 * @swagger
 * /api/checkout:
 *   post:
 *     summary: Checkout the cart and create an order
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order created successfully
 *       401:
 *         description: Not authenticated
 */
cartRouter.post('/api/checkout', validateCheckout, checkout);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated
 *       404:
 *         description: Cart item not found
 */
cartRouter.patch('//:itemId', validateId('itemId'), validateUpdateCart, updateCartItemQuantity);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cart item removed
 *       404:
 *         description: Cart item not found
 */
cartRouter.delete('//:itemId', validateId('itemId'), deleteCartItem);

/**
 * @swagger
 * /api/payments/paypal/webhook:
 *   post:
 *     summary: PayPal payment webhook
 *     tags: [Cart]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payment approved
 */
cartRouter.post("/api/payments/paypal/webhook", approvePayment);

export default cartRouter;
