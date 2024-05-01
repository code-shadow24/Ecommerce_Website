import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
    role: {
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
    },
    isActive: {
        type: Boolean,
    },
    isLocked: {
        type: Boolean,
    },
    lockOutTimeStamp: {
        type: Date,
    },
    failedLoginAttempt:{
        type: Number,
        defaultValue: 0,
    },
    refreshToken: {
        type: String,
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
    },
    sellerManagement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SellerManagement",
    },
    productManagement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
    },
    orderManagement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
    },
    analyticsReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AnalyticsReport",
    },
    promotionCampaigns: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    },
    activityLog: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ActivityLog",
    }
},{timestamps: true})


adminSchema.pre('save', async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 14)
    next()
})

adminSchema.methods.passwordCheck = async function(password){
    return await bcrypt.compare(password, this.password)
}

adminSchema.methods.accessTokenGenerator = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_SECRET_TOKEN_EPIRY
        }
    )
}

adminSchema.methods.refreshTokenGenerator = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_SECRET_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_SECRET_TOKEN_EPIRY
        }
    )
}


export const Admin = mongoose.model("Admin", adminSchema)