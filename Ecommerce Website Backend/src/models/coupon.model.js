import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    couponId: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        required: true
    },
    discountAmount: {
        type: Number,
        default: 0
    },
    minimumPurchaseAmount: {
        type: Number,
        required: true
    },
    expirationDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        required: true
    },
    usageCount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    redemptionTracking: [
        {
            type: String,
        }
    ],
    userRestrictions: [
        {
            type: String,
        }
    ],
    redemptionStatus: {
        type: String,
        required: true
    }
},{timestamps: true})

export const Coupon = mongoose.model("Coupon", couponSchema);