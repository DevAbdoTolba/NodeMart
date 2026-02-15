import userModel from '../models/userModel.js'
import * as bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import sendEmail from '../utils/email.js'

dotenv.config({path: '../../.env'});


export async function Register(req, res) {
    let candidate = req.body;
    let hashedPassword = bcrypt.hashSync(candidate.password, Number.parseInt(process.env.BCRYPT_SALT_ROUNDS));
    candidate.password = hashedPassword;
    const insertRes = await userModel.insertOne(candidate);
    if(insertRes) {
        sendEmail(insertRes.email, insertRes.name);
        insertRes.password = undefined;
        res.status(200).json({message: "User created successfully", data: insertRes});
    } else {
        res.status(400).json({message: "couldn't create user try again later"});
    }
}