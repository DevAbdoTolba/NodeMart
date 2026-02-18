import express from 'express'
import { addGuest, confirmEmail, Login, Register } from '../controllers/authController.js'
import { validateEmail } from '../middlewares/validateEmail.js';
import { validateData } from '../middlewares/validateData.js'

const userRouter = express.Router();

userRouter.post("/api/auth/register", validateEmail, validateData, Register);
userRouter.post("/api/auth/login", Login);
userRouter.post("/api/auth/guest", addGuest);
userRouter.get("/api/auth/:email", confirmEmail);

export default userRouter;