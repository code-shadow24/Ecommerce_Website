import mongoose from "mongoose"

const ratingSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    ratingNumber: {
        type: Number,
        required: true
    },
    reviewTitle: {
        type: String,
    },
    reviewText: {
        type: String,
    },
    reviewDate:{
        type: Date,
        required: true
    },
    helpVotes: {
        type: Number
    },
    unhelpfulVotes: {
        type: Number
    },
    sellerResponse: {
        type: String
    },
    reviewImages: {
        type: String
    },
    reviewVideos: {
        type: String
    }
}, {timestamps: true})

export const Rating = mongoose.model("Rating", ratingSchema)