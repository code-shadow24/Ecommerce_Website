import mongoose from "mongoose";

const payementSchema = new mongoose.Schema({
    paymentId:{
        type: String,
        required: true
    },
    payerId: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    createTime: {
        type: Date,
        required: true
    },
    updateTime: {
        type: Date,
        required: true
    },
    salesId: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const Payment = mongoose.model("Payment", payementSchema);