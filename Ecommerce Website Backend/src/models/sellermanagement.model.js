import mongoose from "mongoose";

const sellermanagementSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    companyName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    businessType: {
        type: String,
        required: true
    },
    businessRegistrationNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Verification",
        required: true
    },
    businessAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    phoneNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    website: {
        type: String,
        required: true
    },
    avatar:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    },
    bankAccountNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    bankName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    IFSCcode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    gstNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Verification",
        required: true
    },
    accountStatus: {
        type: String,
        required: true
    },
    verificationStatus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Verification",
        required: true
    },
    verificationDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Verification",
    },
    isActive: {
        type: Boolean,
        required: true
    }
},{timestamps: true})

export const SellerManagement = mongoose.model("SellerManagement", sellermanagementSchema)