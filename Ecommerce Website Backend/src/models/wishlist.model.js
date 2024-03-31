import mongoose from "mongoose"

const wishlistSchema = new mongoose.Schema({
    productImage:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    BrandName:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    productTitle:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    originalPrice:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    discountedPrice:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }

},{timestamps: true})

export const Wishlist = mongoose.model("Wishlist", wishlistSchema)