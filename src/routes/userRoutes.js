import express from 'express'
import { addGuest, confirmEmail, Login, Register } from '../controllers/authController.js'
import { validateEmail } from '../middlewares/validateEmail.js';
import { validateData } from '../middlewares/validateData.js'

const userRouter = express.Router();

const mapTokenParamToEmail = (req, res, next) => {
    if (req.params && req.params.token && !req.params.email) {
        req.params.email = req.params.token;
    }
    next();
};

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user account
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, phone, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [customer, admin]
 *               status:
 *                 type: string
 *                 enum: [Guest, Approved, Restricted, Deleted, Unverified]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
userRouter.post("/api/auth/register", validateEmail, validateData, Register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user and return JWT token
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Wrong credentials
 */
userRouter.post("/api/auth/login", Login);

/**
 * @swagger
 * /api/auth/guest:
 *   post:
 *     summary: Create guest account (status Guest)
 *     tags: [auth]
 *     responses:
 *       201:
 *         description: Guest user created
 */
userRouter.post("/api/auth/guest", addGuest);

/**
 * @swagger
 * /api/auth/{token}:
 *   get:
 *     summary: Confirm user email by token
 *     tags: [auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email confirmed
 *       400:
 *         description: Invalid token
 *       404:
 *         description: User not found
 */
userRouter.get("/api/auth/:token", mapTokenParamToEmail, confirmEmail);

export default userRouter;
