import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { SellerNotification } from "../models/sellernotification.model.js";
import { Seller } from "../models/seller.model.js";
import { sendEmail } from "../utils/emails/emailservice.js";

const getAllSellerNotification = asyncHandler(async(req, res)=>{
    const sellerNotifications = await SellerNotification.find()

    if(sellerNotifications.length == 0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Seller Notification Found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Seller Notification Retrieved Successfully", sellerNotifications)
    )
})
const getUnreadSellerNotification = asyncHandler(async(req, res)=>{
    const unreadSellerNotification = await SellerNotification.find({isRead: false})

    if(unreadSellerNotification.length == 0){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Unread Notification Available")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Unread Notifications Fetched Successfully", unreadSellerNotification)
    )
})

const markSellerNotificationAsRead = asyncHandler(async(req, res)=>{
    const notificationId = req.params.id;

    const notification = await SellerNotification.findById(notificationId);
    
    if(!notification){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Notification found")
        )
    }

    notification.isRead = true;
    await notification.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Seller Notification Marked as Read", notification)
    )
})

const markAllSellerNotificationAsRead = asyncHandler(async(req, res)=>{
    const {sellerId} = req.body

    if(!sellerId){
        throw new ApiError(400, "Seller Id is required")
    }

    const readNotification = await SellerNotification.updateMany({sellerId: sellerId, isRead: false},{$set: {isRead: true}})

    if(!readNotification){
        return res
        .status(404)
        .json(
            new ApiResponse(404, "No Unread Notification found")
        )
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "All Notifications updated successfully", readNotification)
    )
})

const sendSellerEmailNotification = asyncHandler(async(req, res)=>{
    const {sellerId, subject, message } = req.body

    if(sellerId?.trim()==""){
        throw new ApiError(400, "Seller Id is required")
    }

    if(subject?.trim()==""){
        throw new ApiError(400, "Subject is required")
    }

    if(message?.trim()==""){
        throw new ApiError(400, "Message is required")
    }

    const seller = await Seller.findById(sellerId)

    if(!seller){
        throw new ApiError(404, "Seller not found")
    }

    sellerEmailId = seller.email

    const emailContent = {
        to: sellerEmailId,
        subject: subject,
        text: message
    }

    const emailNotification = await SellerNotification.create({
        sellerId: seller._id,
        subject,
        message,
        typeofNotification: 'Email',
        timeStamp: new Date(),
        isRead: false
    })

    if(!emailNotification){
        throw new ApiError(500, "Error occurred while creating notification")
    }

    const emailSent = await sendEmail(emailContent)

    if(!emailSent){
        throw new ApiError(500, "Error occurred while sending notification")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Email sent successfully", {emailNotification, emailSent})
    )
})





export{
    getAllSellerNotification,
    getUnreadSellerNotification,
    markSellerNotificationAsRead,
    markAllSellerNotificationAsRead,
    sendSellerEmailNotification,
}