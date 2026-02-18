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

userRouter.post("/api/auth/register", validateEmail, validateData, Register);
userRouter.post("/api/auth/login", Login);
userRouter.post("/api/auth/guest", addGuest);
userRouter.get("/api/auth/:token", mapTokenParamToEmail, confirmEmail);

export default userRouter;