import mongoose from "mongoose"

const wishlistSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productImage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productTitle:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    originalPrice:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    discountedPrice:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productAvailability: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true
    }

},{timestamps: true})

export const Wishlist = mongoose.model("Wishlist", wishlistSchema)