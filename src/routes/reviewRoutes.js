import express from "express";
import { createReview, getReviews, updateReview, deleteReview } from "../controllers/reviewController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validateCreateReview, validateId } from "../middlewares/validationMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management
 */

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review (must have purchased the product)
 *     tags: [Reviews]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - review
 *               - ratings
 *               - product
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Awesome Product!"
 *               review:
 *                 type: string
 *                 example: "Amazing product, loved it!"
 *               ratings:
 *                 type: number
 *                 example: 5
 *               product:
 *                 type: string
 *                 example: "6996d1bd214687cdd64bf83c"
 *     responses:
 *       201:
 *         description: Review created successfully
 *       400:
 *         description: Already reviewed this product
 *       403:
 *         description: Must purchase product before reviewing
 */
router.post("/", protect, validateCreateReview, createReview);

/**
 * @swagger
 * /api/reviews/{productId}:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - name: productId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reviews for the product
 */
router.get("/:productId", validateId('productId'), getReviews);

/**
 * @swagger
 * /api/reviews/{id}:
 *   patch:
 *     summary: Update your own review
 *     tags: [Reviews]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               review:
 *                 type: string
 *               ratings:
 *                 type: number
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       403:
 *         description: Can only update your own reviews
 */
router.patch("/:id", validateId(), protect, updateReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review (owner or admin)
 *     tags: [Reviews]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Review deleted successfully
 *       403:
 *         description: Can only delete your own reviews
 */
router.delete("/:id", validateId(), protect, deleteReview);

export default router;
