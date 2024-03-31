import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    brandName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    productTitle: {
        type : String,
        required: true
    },
    quantity: {
        type : Number,
        default : 0
    },
    sizes: {
        type: [{
            type : String,
        }]
    },
    colors: {
        type: [{
            type: String
        }]
    },
    originalPrice: {
        type: Number,
        required: true
    },
    discountedPrice: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory"
    },
    productImage: [{
        type: String
    }],
    description: {
        type: String
    }
})

export const Product = mongoose.model('Product', productSchema)