import express from "express";
import {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct} from "../controllers/productController.js";
import { validateCreateProduct, validateUpdateProduct, validateId } from "../middlewares/validationMiddleware.js";
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management APIs
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
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
 *         description: "Sort fields (comma-separated). Prefix with - for descending (e.g. -createdAt,name)"
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: "Fields to include (comma-separated, e.g. name,description)"
 *     responses:
 *       200:
 *         description: Paginated list of products
 *       400:
 *         description: Limit exceeds maximum of 20
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /api/products/{id}:
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
router.get("/:id", validateId(), getProduct);

router.use(protect);
router.use(restrictTo("admin"));

/**
 * @swagger
 * /api/products:
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
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", validateCreateProduct, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update product
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               image:
 *                 type: string
 *               category:
 *                 type: string
 *                 description: Category ID
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.patch("/:id", validateId(), validateUpdateProduct, updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted successfully
 */
router.delete("/:id", validateId(), deleteProduct);

export default router;
