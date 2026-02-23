import express from "express";
import { getAllCategories, getCategory, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { validateCreateCategory, validateUpdateCategory, validateId } from "../middlewares/validationMiddleware.js";
import { protect, restrictTo } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management APIs
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
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
 *         description: Paginated list of categories
 *       400:
 *         description: Limit exceeds maximum of 20
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get single category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category data
 */
router.get("/:id", validateId(), getCategory);

router.use(protect);
router.use(restrictTo("admin"));

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post("/", validateCreateCategory, createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   patch:
 *     summary: Update category
 *     tags: [Categories]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.patch("/:id", validateId(), validateUpdateCategory, updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:id", validateId(), deleteCategory);

export default router;
