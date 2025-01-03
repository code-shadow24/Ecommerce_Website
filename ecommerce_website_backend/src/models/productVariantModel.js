import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productTitle: {
        type: String,
        required: true
    },
    sizes: {
        type: [String],
    },
    colors: {
        type: [String],
    },
    originalPrice: {
        type: Number,
    },
    discountedPrice: {
        type: Number,
    },
    productImages: [{
        type: String,
    }]
}, { timestamps: true });

export const Variant = mongoose.model('Variant', variantSchema);
