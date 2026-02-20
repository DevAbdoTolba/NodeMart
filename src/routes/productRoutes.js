import express from 'express';
import * as productController from '../controllers/productController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */
router.get(
  '/',
  productController.getAllProducts
);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
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
 *                 example: iPhone 14
 *               price:
 *                 type: number
 *                 example: 1200
 *               stock:
 *                 type: number
 *                 example: 50
 *               image:
 *                 type: string
 *                 example: http://example.com/image.jpg
 *               category:
 *                 type: string
 *                 example: 64f...abc123
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post('/', protect, restrictTo('admin'), productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details with populated category
 */
router.get('/:id', productController.getProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *                 example: iPhone 14 Pro
 *               price:
 *                 type: number
 *                 example: 1300
 *               stock:
 *                 type: number
 *                 example: 40
 *               image:
 *                 type: string
 *                 example: http://example.com/new-image.jpg
 *               category:
 *                 type: string
 *                 example: 64f...abc123
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.patch('/:id', protect, restrictTo('admin'), productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Product deleted successfully
 */
router.delete('/:id', protect, restrictTo('admin'), productController.deleteProduct);

export default router;