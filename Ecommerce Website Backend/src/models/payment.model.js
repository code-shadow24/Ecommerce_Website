import mongoose from "mongoose";

const payementSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    order : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["Credit card", "Debit card", "Razorpay", "NetBanking", "Cash on Delivery"],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Succeeded", "Cancelled", "Failed"],
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    transactionId : {
        type: String,
        required: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    paymentGateway: {
        type: String,
        required: true
    },
    paymentDetails: {
        type: String
    },
    authorizationCode: {
        type: String,
        required: true
    },
    paymentInvoice: {
        type: String,
        required: true
    },

}, {timestamps: true})

export const Payment = mongoose.model("Payment", payementSchema);