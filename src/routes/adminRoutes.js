import express from "express";
import { getOrders, updateOrderStatus, getStats } from "../controllers/adminController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateUpdateOrderStatus, validateId } from "../middlewares/validationMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin endpoints for managing orders and stats
 */

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Admin]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */

/**
 * @swagger
 * /api/admin/orders/{id}:
 *   patch:
 *     summary: Update order status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: Shipped
 *     responses:
 *       200:
 *         description: Updated order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 */

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get admin stats (total revenue and total orders)
 *     tags: [Admin]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                       example: 1500
 *                     totalOrders:
 *                       type: integer
 *                       example: 10
 */

router.use(protect);
router.use(restrictTo("admin"));

router.get("/orders", getOrders);
router.patch("/orders/:id", validateId(), validateUpdateOrderStatus, updateOrderStatus);
router.get("/stats", getStats);

export default router;
