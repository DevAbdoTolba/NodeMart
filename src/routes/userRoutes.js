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
  * /api/users/register:
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
  *     responses:
  *       201:
  *         description: User registered successfully
  *       400:
  *         description: Validation error
  */
 userRouter.post("/register", validateEmail, validateData, Register);
 
 /**
  * @swagger
  * /api/users/login:
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
 userRouter.post("/login", validateLogin, Login);
 
 /**
  * @swagger
  * /api/users/guest:
  *   post:
  *     summary: Create guest account (status Guest)
  *     tags: [auth]
  *     responses:
  *       201:
  *         description: Guest user created
  */
 userRouter.post("/guest", addGuest);
 
 /**
  * @swagger
  * /api/users/confirmEmail/{token}:
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
 userRouter.get("/confirmEmail/:token", mapTokenParamToEmail, confirmEmail);
 
 // ======= User Profile Routes (require login) =======

 /**
  * @swagger
  * /api/users/me:
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
 userRouter.get("/me", protect, getMe);
 
 /**
  * @swagger
  * /api/users/me:
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
 userRouter.patch("/me", protect, validateUpdateMe, updateMe);
 
 /**
  * @swagger
  * /api/users/me:
  *   delete:
  *     summary: Delete current user account
  *     tags: [User]
  *     security:
  *       - tokenAuth: []
  *     responses:
  *       204:
  *         description: User deleted
  */
 userRouter.delete("/me", protect, deleteMe);
 
 /**
  * @swagger
  * /api/users/{id}/status:
  *   patch:
  *     summary: Block/Unblock a user (Admin only)
  *     tags: [Admin]
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
 userRouter.patch("/:id/status", protect, restrictTo("admin"), validateId('id'), validateUpdateUserStatus, updateUserStatus);
 
 export default userRouter;