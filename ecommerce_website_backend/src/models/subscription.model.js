import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["Subscribed", "Unsubscribed"]
    },
},{timestamps: true})

export const Subscription = mongoose.model("Subscription", subscriptionSchema)