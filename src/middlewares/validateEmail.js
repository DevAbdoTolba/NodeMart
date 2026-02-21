import userModel from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

export const validateEmail = catchAsync(async (req, res, next) => {
    const normalizedEmail = typeof req.body.email === "string" ? req.body.email.toLowerCase().trim() : req.body.email;
    let emailFound = await userModel.findOne({ email: normalizedEmail });
    if(emailFound) {
        return next(new AppError("email already exists", 400));
    }
    next();
});