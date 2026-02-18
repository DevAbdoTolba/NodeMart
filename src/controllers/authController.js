import * as bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { v7 as uuid } from 'uuid'
import userModel from '../models/userModel.js'
import * as apiHandler from './handlerFactory.js'
import sendEmail from '../utils/email.js'
import AppError from '../utils/appError.js'

dotenv.config({path: '../../.env'});


export async function Register(req, res, next) {
    const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS);
    req.body.password = bcrypt.hashSync(req.body.password, saltRounds);
    const registerUser = apiHandler.createOne(userModel);

    const originalJson = res.json;
    res.json = body => {
        const createdUser = body?.data?.data;
        if (createdUser) {
            sendEmail(createdUser.email, createdUser.name).catch(() => {});
            createdUser.password = undefined;
        }
        return originalJson.call(res, body);
    };
    return registerUser(req, res, next);
}

export async function Login(req, res, next) {
    const userCredentials = req.body;
    const findUser = await userModel.findOne({email: req.body.email});
    if(findUser) {
        const checkPassword = bcrypt.compareSync(req.body.password, findUser.password);
        if(!checkPassword) next(new AppError("email not found", 401));
        findUser.password = undefined;
        const token = jwt.sign({findUser}, process.env.TOKEN_SECRET_KEY);
        res.status(200).json({message: "login successful", token: token});
    } else {
        next(new AppError("email not found", 401));
    }
}

export async function confirmEmail(req, res, next) {
    const email = jwt.verify(req.params.email, process.env.TOKEN_SECRET_KEY);
    const updateUser = apiHandler.updateOne(userModel);
    req.params.searchBy = "email";
    req.params.value = email;
    let originalJson = res.json;
    res.json = body => originalJson.call(res, "email verified successfully");
    return updateUser(req, res, next);
}

export async function addGuest(req, res, next) {
    req.body = {
        email: uuid(),
        status: "Guest"
    }
    // let createGuest = apiHandler.createOne(userModel);
    // return createGuest(req, res, next);
    return apiHandler.createOne(userModel)(req, res, next);
}