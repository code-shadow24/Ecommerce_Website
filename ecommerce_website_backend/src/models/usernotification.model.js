import mongoose from "mongoose";

const usernotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subject: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    typeofNotification: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Read", "Unread"]
    },
    timeStamp: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
},{timestamps: true});

export const UserNotification = mongoose.model("UserNotification", usernotificationSchema)