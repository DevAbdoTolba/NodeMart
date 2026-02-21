 import express from 'express'
 import { addGuest, confirmEmail, Login, Register } from '../controllers/authController.js'
 import { getMe, updateMe, deleteMe, updateUserStatus } from '../controllers/userController.js'
 import { protect, restrictTo } from '../middlewares/authMiddleware.js'
 import { validateEmail } from '../middlewares/validateEmail.js';
 import { validateData } from '../middlewares/validateData.js'
 import { validateLogin, validateUpdateMe, validateUpdateUserStatus, validateId } from '../middlewares/validationMiddleware.js'
 
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
  *                 enum: [Unverified, Approved, Restricted, Deleted, Guest]
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
  *                 example: nesmaaa@example.com
  *               password:
  *                 type: string
  *                 example: my@Password123
  *     responses:
  *       200:
  *         description: Login successful
  *       401:
  *         description: Wrong credentials
  */
 userRouter.post("/api/auth/login", validateLogin, Login);
 
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
 
 // ======= User Profile Routes (require login) =======

 /**
  * @swagger
  * /api/user/me:
  *   get:
  *     summary: Get current logged-in user profile
  *     tags: [User]
  *     security:
  *       - tokenAuth: []
  *     responses:
  *       200:
  *         description: User profile data
  *       401:
  *         description: Not logged in
  */
 userRouter.get("/api/user/me", protect, getMe);
 
 /**
  * @swagger
  * /api/user/me:
  *   patch:
  *     summary: Update current user (name, email, phone)
  *     tags: [User]
  *     security:
  *       - tokenAuth: []
  *     requestBody:
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
  *         description: User updated
  */
 userRouter.patch("/api/user/me", protect, validateUpdateMe, updateMe);
 
 /**
  * @swagger
  * /api/user/me:
  *   delete:
  *     summary: Delete current user account
  *     tags: [User]
  *     security:
  *       - tokenAuth: []
  *     responses:
  *       204:
  *         description: User deleted
  */
 userRouter.delete("/api/user/me", protect, deleteMe);
 
 /**
  * @swagger
  * /api/user/{id}/status:
  *   patch:
  *     summary: Block/Unblock a user (Admin only)
  *     tags: [User]
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
  *               isBlocked:
  *                 type: boolean
  *     responses:
  *       200:
  *         description: User status updated
  *       404:
  *         description: User not found
  */
 userRouter.patch("/api/user/:id/status", protect, restrictTo("admin"), validateId('id'), validateUpdateUserStatus, updateUserStatus);
 
 export default userRouter;