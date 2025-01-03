import nodemailer from 'nodemailer'
import { createTransport } from 'nodemailer';
import { ApiError } from '../apiError.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'pickingsinfinite@gmail.com',
        password: '!nF!N!teP!cK!ng$23'
    }
})

async function sendEmail(emailContent){
    try {
        await transporter.sendMail(emailContent)
        console.log("Email sent successfully")
    } catch (error) {
        throw new ApiError(500, "Error sending email", error)
    }
}

export {sendEmail}