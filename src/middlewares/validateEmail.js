import userModel from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import joi from "joi";

const emailSchema = joi.object({
    email: joi.string().email().required().messages(
        {
            "string.email": "Invalid email format",
            "string.required": "Email is required",
        }
    )
}).unknown(true);


export const validateEmail = catchAsync(async (req, res, next) => {
    const {error, value} = emailSchema.validate(req.body);
    if(error) {
        return next(new AppError(error.details[0].message, 400));
    }
    const normalizedEmail = value.email;
    let emailFound = await userModel.findOne({ email: normalizedEmail });
    if(emailFound) {
        return next(new AppError("email already exists", 400));
    }
    next();
});