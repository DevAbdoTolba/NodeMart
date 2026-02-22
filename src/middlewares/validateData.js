import joi from 'joi'
import AppError from '../utils/appError.js'

const userValidationSchema = joi.object({
    name: joi.string().min(3).max(60).required().messages(
        {
            "string.min": "Too short name, minmum 3 characters",
            "string.max": "Too long name, maximum 60 characters",
            "string.required": "Name is required"
        }
    ),

    password: joi.string()
        .min(8)
        .max(50)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^0-9a-zA-Z]).{8,50}$'))
        .required()
        .messages(
            {
                "string.min": "Too short password, minmum 8 characters",
                "string.max": "Too long password, maximum 50 characters",
                "string.pattern.base": "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
            }
        ),

    phone: joi.string().length(11).pattern(new RegExp('^01[0125][0-9]{8}$')).required()
    .messages(
        {
            "string.length": "Phone number must be 11 digits",
            "string.pattern.base": "Invalid phone number (We only support Egypt NTRA phone numbers)"
        }
    ),

    role: joi.forbidden().messages(
        {
            "any.unknown": "You are not allowed to set role"
        }
    ),
    status: joi.forbidden().messages(
        {
            "any.unknown": "You are not allowed to set status"
        }
    ),
    walletBalance: joi.forbidden().messages(
        {
            "any.unknown": "You are not allowed to set wallet balance"
        }
    )
});

export function validateData(req, res, next) {        
    const valid = userValidationSchema.validate(req.body, {allowUnknown: true});
    if(valid.error) {
        return next(new AppError(valid.error.details[0].message, 400));
    }
    next();
}