import mongoose from "mongoose";

const sellernotificationSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
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

export const SellerNotification = mongoose.model("SellerNotification", sellernotificationSchema)