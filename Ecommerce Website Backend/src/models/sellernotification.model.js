import mongoose from "mongoose";

const sellernotificationSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    subject: {
        type: String,
    },
    message: {
        type: String,
        required: true
    },
    typeofNotification: {
        type: String,
        required: true
    },
    timeStamp: {
        type: Date,
        required: true
    },
    isRead: {
        type: Boolean,
        required: true
    }
},{timestamps: true});

export const SellerNotification = mongoose.model("SellerNotification", sellernotificationSchema)