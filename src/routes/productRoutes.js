import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get("/", productController.getAllProducts);

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", productController.createProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Get single product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data
 */
router.get("/:id", productController.getProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
 */
router.patch("/:id", productController.updateProduct);

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 */
router.delete("/:id", productController.deleteProduct);

export default router;
