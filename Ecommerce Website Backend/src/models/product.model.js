import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    productTitle: {
        type : String,
        required: true
    },
    quantity: {
        type : mongoose.Schema.Type.ObjectId,
        ref: "Inventory",
        required: true
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
    },
    stockKeepingUnit: {
        type: String,
        required : true
    },
    barcode: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    },
    dimensions: {
        length: {
            type: Number
        },
        breadth: {
            type: Number
        },
        height: {
            type: Number
        }
    },
    visibilityStatus: {
        type : String
    },
    metaTitle: {
        type : String
    },
    metaDescription: {
        type : String
    },
    metaKeywords: [
        {
            type : String
        }
    ]
}, { timestamps: true})

export const Product = mongoose.model('Product', productSchema)