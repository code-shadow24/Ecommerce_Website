import mongoose from "mongoose";

const usermanagementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    password: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    roleId: {
        type: String,
        required: true
    },
    firstName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    lastName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    phoneNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isActive: {
        type: Boolean,
        required: true
    },
    lastLogin: {
        type: Date,
        required: true
    },
    failedLoginAttempts: {
        type: Number,
        default: 0,
        required: true
    },
    lockoutTimeStamps: {
        type: Date,
    }
},{timestamps: true})

export const UserManagement = mongoose.model("UserManagement", usermanagementSchema)