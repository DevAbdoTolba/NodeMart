import userModel from "../models/userModel.js";

export async function validateEmail(req, res, next) {
    let emailFound = await userModel.findOne({email: req.body.email});
    if(emailFound) {
        res.status(400).json({message: "email already exists"});
    } else {
        next()
    }
}