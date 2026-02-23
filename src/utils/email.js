import nodeMailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import emailTemplate from './emailTemplate.js'
import dotenv from 'dotenv'

dotenv.config();

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWD
    }
});

export default async function sendEmail(email, name) {
    const encryptedEmail = jwt.sign({email: email}, process.env.TOKEN_SECRET_KEY, {expiresIn: '1h'});
    const emailInfo = await transporter.sendMail({
        to: email,
        from: process.env.EMAIL_SENDER,
        subject: "SignedUp in NodeMart",
        text: "Thank You For Signing in NodeMart, Please Verify Your Email!",
        html: emailTemplate(encryptedEmail, name)
    })
}
