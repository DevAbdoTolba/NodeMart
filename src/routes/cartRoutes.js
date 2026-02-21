import express from 'express';
import {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItems
} from '../controllers/cartController.js';
import { validateAddToCart, validateUpdateCart, validateId } from '../middlewares/validationMiddleware.js';

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
 *         description: JWT token
 *     responses:
 *       200:
 *         description: Cart items retrieved
 *       401:
 *         description: Token missing or invalid
 */
cartRouter.get('/api/cart', getCartItems)

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart (creates guest if no token)
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         description: JWT token (optional — creates guest if missing)
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
 *                 example: "6996d1bd214687cdd64bf83c"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Missing productId or invalid quantity
 */
cartRouter.post('/api/cart', validateAddToCart, addItemToCart);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID of the cart item
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
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cart item quantity updated
 *       404:
 *         description: Cart item not found
 */
cartRouter.patch('/api/cart/:itemId', validateId('itemId'), validateUpdateCart, updateCartItemQuantity);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: header
 *         name: token
 *         schema:
 *           type: string
 *         description: JWT token
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID of the cart item
 *     responses:
 *       200:
 *         description: Cart item removed
 *       404:
 *         description: Cart item not found
 */
cartRouter.delete('/api/cart/:itemId', validateId('itemId'), deleteCartItem);

export default cartRouter;
