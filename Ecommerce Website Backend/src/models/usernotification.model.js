import mongoose from "mongoose";

const usernotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    },
    link: {
        type: String,
    },
    metaData: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: true
    }
},{timestamps: true});

export const UserNotification = mongoose.model("UserNotification", usernotificationSchema)