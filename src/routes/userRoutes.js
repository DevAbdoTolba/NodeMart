import express from "express";
import * as userController from "../controllers/userController.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user details
 */
router.get("/me", protect, userController.getMe);

/**
 * @swagger
 * /me:
 *   patch:
 *     summary: Update current user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user details
 */
router.patch("/me", protect, userController.updateMe);

/**
 * @swagger
 * /me:
 *   delete:
 *     summary: Delete current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted
 */
router.delete("/me", protect, userController.deleteMe);

/**
 * @swagger
 * /{id}/status:
 *   patch:
 *     summary: Admin updates user status (block/unblock)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
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
 *               isBlocked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated user status
 */
router.patch("/:id/status", protect, restrictTo("admin"), userController.updateUserStatus);

export default router;
