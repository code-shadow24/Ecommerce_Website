import { asyncHandler } from "../utils/asyncHandle.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { UserNotification } from "../models/usernotification.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../utils/emails/emailservice.js";

const getAllNotifications = asyncHandler(async (req, res) => {
  const allNotifications = await UserNotification.find();

  if (allNotifications.length == 0) {
    return res.status(404).json(new ApiResponse(404, "No notifications found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "All notifications fetched successfully",
        allNotifications
      )
    );
});
const getUnreadNotifications = asyncHandler(async (req, res) => {
  const unreadNotifications = await UserNotification.find({ status: "Unread" });

  if (unreadNotifications.length == 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, "No Unread Notifications Available"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "All Unread Notifications Fetched Successfully",
        unreadNotifications
      )
    );
});
const markNotificationsAsRead = asyncHandler(async (req, res) => {
    const notificationId = req.params.id;

    const notification = await UserNotification.findById(notificationId);

    if(!notification){
        throw new ApiError(404, "Notification not found")
    }

    notification.status = "Read"
    await notification.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, "Notification marked as read successfully", notification)
    )

});
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.body

    if(!userId) {
        throw new ApiError(400, "User Id is required")
    }

    const readNotifications = await UserNotification.updateMany({userId: userId, status: "Unread"},{$set:{status: "Read"}})

    if(!readNotifications){
      return res
      .status(404)
      .json(
          new ApiResponse(404, "No Unread Notification found")
      )
    }

    return res
    .status(200)
    .json(
      new ApiResponse(200, "All Unread Notification Marked as Read", readNotifications)
    )
});
const deleteNotification = asyncHandler(async (req, res) => {
  const notificationId = req.params.id;

  try {
    await UserNotification.findByIdAndDelete(notificationId)
    return res
    .status(200)
    .json(
      new ApiResponse(200, "Notification deleted successfully", null)
    )
  } catch (error) {
    throw new ApiError(500, "Error occurred while deleting notification", error)
  }
});

const sendEmailNotification = asyncHandler(async (req, res) => {
  const {userId, subject, message} = req.body

  if(userId?.trim()==""){
    throw new ApiError(400, "UserId cannot be empty")
  }

  if(subject?.trim()==""){
    throw new ApiError(400, "Subject is required")
  }

  if(message?.trim()==""){
    throw new ApiError(400, "Message is required")
  }

  const user = await User.findById(userId)

  if(!user){
    throw new ApiError(404, "User not found")
  }

  const userEmail = user.emailAddress

  const emailContent = {
    to: userEmail,
    subject: subject,
    text: message
  }

  const isActive = await UserNotification.findOne({userId: user.id})

  if(isActive==false){
    throw new ApiError(500, "Notification not enabled")
  }
  const newNotification = await UserNotification.create({
    userId: user._id,
    subject,
    message,
    typeofNotification: 'Email',
    status: "Unread",
    timeStamp: new Date(),
  })

  if(!newNotification){
    throw new ApiError(500, "Error occurred while creating notification")
  }

  const emailSent = await sendEmail(emailContent)

  if(!emailSent){
    throw new ApiError(500, "Error occurred while sending notification")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Notification Sent Successfully", {newNotification, emailSent})
  )
});

const enableNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  const enabled = await UserNotification.find({userId: userId},{$set: {isActive: true}})

  if(!enabled){
    throw new ApiError(500, "Error occurred while enabling notifications")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Notifications enabled successfully", enabled)
  )
});
const disableNotifications = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  const disabled = await UserNotification.find({userId: userId},{$set: {isActive: false}})

  if(!disabled) {
    throw new ApiError(500, "Error occured while disabling notifications")
  }

  return res
  .status(200)
  .json(
    new ApiResponse(200, "Notifications disabled successfully", disabled)
  )
});

export {
  getAllNotifications,
  getUnreadNotifications,
  markNotificationsAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  sendEmailNotification,
  enableNotifications,
  disableNotifications,
};
