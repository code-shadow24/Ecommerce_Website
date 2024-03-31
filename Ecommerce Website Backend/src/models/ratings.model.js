import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema({
    customerName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    avatar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    productId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    starRating: {
        type: Number,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    longDescription: {
        type: String
    },
    email: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export const Rating = mongoose.model("Rating", ratingSchema)