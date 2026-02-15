import express from 'express'
import { Register } from '../controllers/userController.js'
import { validateEmail } from '../middlewares/validateEmail.js';
import { validateData } from '../middlewares/validateData.js'

const userRouter = express.Router();

userRouter.post("/api/auth/register", validateEmail, validateData, Register);

export default userRouter;