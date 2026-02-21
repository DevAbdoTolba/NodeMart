import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v7 as uuid } from 'uuid'
import userModel from '../models/userModel.js'
import * as apiHandler from './handlerFactory.js'
import catchAsync from '../utils/catchAsync.js'
import sendEmail from '../utils/email.js'
import AppError from '../utils/appError.js'


export const Register = catchAsync(async (req, res, next) => {
    const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS);
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
    const registerUser = apiHandler.createOne(userModel);

    const originalJson = res.json;
    res.json = body => {
        const createdUser = body?.data?.data;
        if (createdUser) {
            // console.log(createdUser);
            sendEmail(createdUser.email, createdUser.name);
            createdUser.password = undefined;
        }
        return originalJson.call(res, body);
    };
    return registerUser(req, res, next);
});

export const Login = catchAsync(async (req, res, next) => {
    const userCredentials = req.body;
    const findUser = await userModel.findOne({email: req.body.email}).select('+password');
    if(findUser) {
        const checkPassword = await bcrypt.compare(req.body.password, findUser.password);
        if(!checkPassword) return next(new AppError("Wrong credentials", 401));
        findUser.password = undefined;
        const token = jwt.sign({data: findUser}, process.env.TOKEN_SECRET_KEY);
        res.status(200).json({message: "login successful", token: token});
    } else {
        next(new AppError("Wrong credentials", 401));
    }
});

export const confirmEmail = catchAsync(async (req, res, next) => {
    let decoded;
    try {
        decoded = jwt.verify(req.params.email, process.env.TOKEN_SECRET_KEY);
    } catch (err) {
        return next(new AppError("Invalid or expired token", 400));
    }
    const { email } = decoded;
    const updateUser = apiHandler.updateOne(userModel);
    req.params.searchBy = "email";
    req.params.value = email;
    req.body = { status: "Approved"};
    let originalJson = res.json;
    res.json = body => originalJson.call(res, "email verified successfully");
    return updateUser(req, res, next);
});

export const addGuest = catchAsync(async (req, res, next) => {
    req.body = {
        email: uuid(),
        status: "Guest"
    }
    // let createGuest = apiHandler.createOne(userModel);
    // return createGuest(req, res, next);
    return apiHandler.createOne(userModel)(req, res, next);
});