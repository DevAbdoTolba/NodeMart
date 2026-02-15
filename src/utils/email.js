import nodeMailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import emailTemplate from './emailTemplate.js'
import dotenv from 'dotenv'

dotenv.config({path: '../../.env'});

export default async function sendEmail(email, name) {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: 'you.mwork@gmail.com',
            pass: 'zeiv fovz abqv dyyl'
        }
    });

    const encryptedEmail = jwt.sign(email, process.env.TOKEN_SECRET_KEY);

    const emailInfo = await transporter.sendMail({
        to: email,
        from: "you.mwork@gmail.com",
        subject: "SignedUp in NodeMart",
        text: "Thank You For Signing in NodeMart, Please Verify Your Email!",
        html: emailTemplate(encryptedEmail, name)
    })
}
