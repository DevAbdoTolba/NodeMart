import express from "express";
import { getMyOrders, getOrder, getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";
import { validateId, validateUpdateOrderStatus } from "../middlewares/validationMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

// All order routes require login
router.use(protect);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get my orders
 *     tags: [Orders]
 *     security: 
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Not authenticated
 */
router.get("/", getMyOrders);

// ---------- Admin only routes ----------

/**
 * @swagger
 * /api/orders/admin/all:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *           default: 5
 *         description: Number of items per page (max 20)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: "Sort fields (comma-separated). Prefix with - for descending (e.g. -createdAt,totalPrice)"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Fields to include (comma-separated, e.g. status,totalPrice)"
 *     responses:
 *       200:
 *         description: Paginated list of all orders
 *       400:
 *         description: Limit exceeds maximum of 20
 *       403:
 *         description: Not authorized
 */
router.get("/admin/all", restrictTo("admin"), getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a single order by ID
 *     tags: [Orders]
 *     security: 
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       403:
 *         description: Not your order
 *       404:
 *         description: Order not found
 */
router.get("/:id", validateId(), getOrder);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (Admin only)
 *     description: Update order status (Pending, Shipped, Delivered). Only admins.
 *     tags: [Orders]
 *     security: 
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Pending, Shipped, Delivered]
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 */
router.patch("/:id/status", restrictTo("admin"), validateId(), validateUpdateOrderStatus, updateOrderStatus);

export default router;
