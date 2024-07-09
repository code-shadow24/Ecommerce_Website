import mongoose from "mongoose";
import { ProductId } from "./productId.model.js";

const dimensionsSchema = new mongoose.Schema({
    length: { type: Number },
    lengthUnit: { type: String },
    width: { type: Number },
    widthUnit: { type: String },
    height: { type: Number },
    heightUnit: { type: String },
}, { _id: false });

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    productTitle: {
        type: String,
        required: true
    },
    sizes: {
        type: [String],
    },
    sizeChart: {
        type: [String],
    },
    colors: {
        type: [String],
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
        type: String,
        required: true
    },
    stockKeepingUnit: {
        type: String,
        required: true
    },
    barcode: {
        type: String,
        required: true
    },
    weight: {
        type: Number
    },
    weightUnit: {
        type: String,
    },
    dimensions: dimensionsSchema,
    modelNo: {
        type: String
    },
    numberOfPieces: {
        type: Number
    },
    capacity: {
        type: Number
    },
    capacityUnit: {
        type: String
    },
    metaTitle: {
        type: String,
        required: true
    },
    metaDescription: {
        type: String,
        required: true
    },
    metaKeywords: [{
        type: String,
        required: true
    }],
    tax: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tax'
    },
    material: {
        type: String,
        required: true
    },
    warranty: {
        type: String,
    },
    expiryDate: {
        type: Date
    }
}, { timestamps: true });

productSchema.pre('save', async function (next) {
    if (!this.productId) {
        let productIdRecord = await ProductId.findOne();
        if (!productIdRecord) {
            productIdRecord = new ProductId();
        }
        const productId = `${productIdRecord.prefix}${productIdRecord.current}`;
        productIdRecord.current += 1;
        await productIdRecord.save();

        this.productId = productId;
    }
    next();
});

export const Product = mongoose.model('Product', productSchema);
