import express from 'express';
import {
  getWishlistItems,
  addItemToWishlist,
  deleteWishlistItem
} from '../controllers/wishlistController.js';
import { validateAddToWishlist, validateId } from '../middlewares/validationMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';
import { accountGuard } from '../middlewares/accountGuard.js';

const wishlistRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management
 */

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get wishlist items for the logged-in user
 *     tags: [Wishlist]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Wishlist items retrieved
 *       401:
 *         description: Token missing or invalid
 */
wishlistRouter.get('/', protect, accountGuard('viewWishlist'), getWishlistItems);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       400:
 *         description: Missing productId or product already in wishlist
 *       404:
 *         description: Product not found
 */
wishlistRouter.post('/', protect, accountGuard('addToWishlist'), validateAddToWishlist, addItemToWishlist);

/**
 * @swagger
 * /api/wishlist/{itemId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       404:
 *         description: Wishlist item not found
 */
wishlistRouter.delete('/:itemId', protect, accountGuard('removeFromWishlist'), validateId('itemId'), deleteWishlistItem);

export default wishlistRouter;
