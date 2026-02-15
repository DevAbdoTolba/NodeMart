import joi from 'joi'

const userValidationSchema = joi.object({
    name: joi.string().min(3).max(60).required(),

    password: joi.string()
        .min(8)
        .max(50)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^0-9a-zA-Z]).{8,50}$'))
        .required(),

    phone: joi.string().length(11).pattern(new RegExp('^01[0125][0-9]{8}$')).required(),

    role: joi.forbidden(),
    status: joi.forbidden(),
    walletBalance: joi.forbidden()
});

export async function validateData(req, res, next) {
    const valid = userValidationSchema.validate(req.body, {allowUnknown: true});
    if(valid.error) {
        res.status(400).json({message: valid.error.details[0].message});
    } else {
        next();
    }
}