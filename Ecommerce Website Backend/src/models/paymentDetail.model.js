import mongoose from "mongoose"

const paymentDetailSchema = new mongoose.Schema({
    cardNumber: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    mobileNumber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    bankName: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const PaymentDetail = mongoose.model("PaymentDetail", paymentDetailSchema)