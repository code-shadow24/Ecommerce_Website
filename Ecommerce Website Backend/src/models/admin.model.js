import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    adminId : {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    profilePicture: {
        type: String,
    },
    lastLogin: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    isLocked: {
        type: Boolean,
        required: true
    },
    lockOutTimeStamp: {
        type: Date,
    },
    failedLoginAttempt:{
        type: Number,
        defaultValue: 0,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    permissions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Permission",
            required: true
        }
    ],
    userManagement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserManagement",
        required: true
    },
    sellerManagement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerManagement",
        required: true
    },
    productManagement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    orderManagement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    analyticsReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AnalyticsReport",
        required: true
    },
    promotionCampaigns: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    },
    activityLog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ActivityLog",
        required: true
    }
},{timestamps: true})

export const Admin = mongoose.model("Admin", adminSchema)