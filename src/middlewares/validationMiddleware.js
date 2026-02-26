import joi from 'joi'
import AppError from '../utils/appError.js'


const validate = (schema, options = { allowUnknown: true }) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, options);
        if(error) {
            return next(new AppError(error.details[0].message, 400));
        }
        next();
    };
};


export const validateId = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        if(id && !/^[0-9a-fA-F]{24}$/.test(id)) {
            return next(new AppError(`Invalid ${paramName}: "${id}"`, 400));
        }
        next();
    };
};



const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});
export const validateLogin = validate(loginSchema);



const createProductSchema = joi.object({
    name: joi.string().min(2).max(100).required(),
    price: joi.number().positive().required(),
    stock: joi.number().integer().min(0),
    image: joi.string(),
    category: joi.string()
});
export const validateCreateProduct = validate(createProductSchema);

const updateProductSchema = joi.object({
    name: joi.string().min(2).max(100),
    price: joi.number().positive(),
    stock: joi.number().integer().min(0),
    image: joi.string(),
    category: joi.string()
}).min(1); // at least one field
export const validateUpdateProduct = validate(updateProductSchema);



const createCategorySchema = joi.object({
    name: joi.string().min(2).max(60).required()
});
export const validateCreateCategory = validate(createCategorySchema);

const updateCategorySchema = joi.object({
    name: joi.string().min(2).max(60)
}).min(1);
export const validateUpdateCategory = validate(updateCategorySchema);



const createReviewSchema = joi.object({
    title: joi.string().min(2).max(100).required(),
    review: joi.string().min(2).max(500).required(),
    ratings: joi.number().integer().min(1).max(5).required(),
    product: joi.string().required()
});
export const validateCreateReview = validate(createReviewSchema);



const addToCartSchema = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().integer().positive().required()
});
export const validateAddToCart = validate(addToCartSchema);

const updateCartSchema = joi.object({
    quantity: joi.number().integer().positive().required()
});
export const validateUpdateCart = validate(updateCartSchema);

const addToWishlistSchema = joi.object({
    productId: joi.string().required()
});
export const validateAddToWishlist = validate(addToWishlistSchema);


// Checkout: address and phone are required (especially for guests who don't have them on file)
const checkoutSchema = joi.object({
    // Require a minimally meaningful address
    address: joi.string().min(10).required(),
    // Use the same Egyptian phone number format as updateMeSchema
    phone: joi.string().length(11).pattern(new RegExp('^01[0125][0-9]{8}$')).required()
});
export const validateCheckout = validate(checkoutSchema);



const updateOrderStatusSchema = joi.object({
    status: joi.string().valid('Pending', 'Shipped', 'Delivered').required()
});
export const validateUpdateOrderStatus = validate(updateOrderStatusSchema);

    
const updateMeSchema = joi.object({
    name: joi.string().min(3).max(60),
    email: joi.string().email(),
    phone: joi.string().length(11).pattern(new RegExp('^01[0125][0-9]{8}$'))
}).min(1);
export const validateUpdateMe = validate(updateMeSchema);

const updateUserStatusSchema = joi.object({
    isBlocked: joi.boolean().required()
});
export const validateUpdateUserStatus = validate(updateUserStatusSchema);
