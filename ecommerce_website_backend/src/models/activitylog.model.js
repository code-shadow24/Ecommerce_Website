import mongoose from "mongoose";

const activitylogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    action: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        required: true,
    },
    ipAddress: {
        type: String,
        required: true,
    },
    details: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: true,
    }
},{timestamps: true})

export const ActivityLog = mongoose.model("ActivityLog", activitylogSchema);