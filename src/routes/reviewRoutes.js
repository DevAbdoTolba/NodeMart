import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

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
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of all reviews
 */
router.get("/", reviewController.getAllReviews);

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a review
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
 */
router.post("/", protect, reviewController.createReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review details
 */
router.get("/:id", reviewController.getReview);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
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
 */
router.delete("/:id", protect, restrictTo("admin"), reviewController.deleteReview);

export default router;
