import userModel from "../models/userModel.js";

export async function validateEmail(req, res, next) {
    const normalizedEmail = typeof req.body.email === "string" ? req.body.email.toLowerCase().trim() : req.body.email;
    let emailFound = await userModel.findOne({ email: normalizedEmail });
    if(emailFound) {
        res.status(400).json({message: "email already exists"});
    } else {
        next()
    }
}