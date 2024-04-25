import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
    refundId: {
        type: String,
        required: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    processedAt: {
        type: Date,
        required: true
    },
    requestedAt: {
        type: Date,
        required: true
    },
    refundMethod: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    refundType: {
        type: String,
        required: true
    },
    note: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

export const Refund = mongoose.model("Refund", refundSchema);