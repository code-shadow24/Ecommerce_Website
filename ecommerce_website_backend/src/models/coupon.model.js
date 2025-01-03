import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
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
        defaultValue: 0
    },
    status: {
        type: String,
        enum: ['active', 'processing', 'applied', 'expired'],
        defaultValue: 'active'
    },
    redemptionStatus: {
        type: String,
    }
},{timestamps: true})

export const Coupon = mongoose.model("Coupon", couponSchema);