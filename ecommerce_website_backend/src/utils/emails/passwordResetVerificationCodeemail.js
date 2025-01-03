import { Admin } from "../../models/admin.model.js";
import { Seller } from "../../models/seller.model.js";
import { User } from "../../models/user.model.js";
import { ApiError } from "../apiError.js";
import { ApiResponse } from "../apiResponse.js";
import { sendEmail } from "./emailservice.js";

async function sendAdminPasswordResetEmail(adminId){

    try {
        const admin = await Admin.findById(adminId);
        const adminEmail = admin.email;

        const verificationCode = Math.floor(Math.random()*100000)

        const emailContent = {
            to: adminEmail,
            subject: 'Password Reset Verification Code',
            text: 'The Verification Code to reset your password is' + verificationCode + '\nThanks and Regards\n Infinite Pickings Team\n\n'
        }

        const emailsent = await sendEmail(emailContent)

        return new ApiResponse(200, "Email sent successfully", emailsent)
    } catch (error) {
        throw new ApiError(500, "Error sending email", error)
    }

}

async function sendSellerPasswordResetEmail(sellerId){
    try {
        const seller = await Seller.findById(sellerId)
        const sellerEmail =  seller.email

        const verificationCode = Math.floor(Math.random()*100000)

        const emailConent = {
            to: sellerEmail,
            subject: 'Password Reset Verification Code',
            text: 'The Verification Code to reset your password is' + verificationCode + '\nThanks and Regards\n Infinite Pickings Team\n\n'
        }

        const emailSent = await sendEmail(emailConent)

        return new ApiResponse(200, "Email sent successfully", emailSent)
    } catch (error) {
        throw new ApiError(500, "Error sending email", error)
    }
}

async function sendUserPasswordResetEmail(userId){
    try {
        const user = await User.findById(userId)
        const userEmail = user.emailAddress

        const verificationCode = Math.floor(Math.random()*100000)

        const emailConent = {
            to: userEmail,
            subject: 'Password Reset Verification Code',
            text: 'The Verification Code to reset your password is' + verificationCode + '\nThanks and Regards\n Infinite Pickings Team\n\n'
        }

        const emailSent = await sendEmail(emailConent)

        return new ApiResponse(200, "Email sent successfully", emailSent)
    } catch (error) {
        throw new ApiError(500, "Error sending email", error)
    }
}

export {
    sendAdminPasswordResetEmail,
    sendSellerPasswordResetEmail,
    sendUserPasswordResetEmail
}