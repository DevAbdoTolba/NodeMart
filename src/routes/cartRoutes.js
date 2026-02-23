import express from 'express';
import {
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  getCartItems,
  checkout
} from '../controllers/cartController.js';
import {approvePayment, confirmPayment} from '../utils/paymentSetup.js';
import { validateAddToCart, validateUpdateCart, validateId } from '../middlewares/validationMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';
import { accountGuard } from '../middlewares/accountGuard.js';

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
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Cart items retrieved
 *       401:
 *         description: Token missing or invalid
 */
cartRouter.get('/', protect, accountGuard('viewCart'), getCartItems)

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - tokenAuth: []
 *       - {}
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
 * /api/cart/checkout:
 *   post:
 *     summary: Checkout the cart and create an order
 *     tags: [Cart]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: ["paypal", "wallet"]
 *               address:
 *                 type: string
 *                 default: "samalot elbalad"
 *               phone:
 *                 type: string
 *                 default: "01000000000"
 *     responses:
 *       200:
 *         description: Order created successfully
 *       401:
 *         description: Not authenticated
 */
cartRouter.post('/checkout', protect, accountGuard('checkout'), checkout);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   patch:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - tokenAuth: []
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     parameters:
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
cartRouter.patch('/:itemId', validateId('itemId'), validateUpdateCart, updateCartItemQuantity);

/**
 * @swagger
 * /api/cart/{itemId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - tokenAuth: []
 *     parameters:
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
cartRouter.delete('/:itemId', validateId('itemId'), deleteCartItem);

/**
 * @swagger
 * /api/cart/payments/paypal/webhook:
 *   post:
 *     summary: PayPal payment webhook
 *     tags: [Payment]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Payment approved
 */
cartRouter.post("/payments/paypal/webhook", approvePayment);

/**
 * @swagger
 * /api/cart/payments/paypal/confirm:
 *   post:
 *     summary: Confirm PayPal payment after buyer approval
 *     tags: [Payment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paypalOrderId]
 *             properties:
 *               paypalOrderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment confirmed, stock updated, cart cleared
 *       400:
 *         description: Payment not completed
 *       404:
 *         description: Order not found
 */
cartRouter.post("/payments/paypal/confirm", confirmPayment);

export default cartRouter;
