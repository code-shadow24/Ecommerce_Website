import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    productName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    stockKeepingUnit : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    barcode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantityAvailable : {
        type: Number,
        required: true
    },
    quantitySold: {
        type: Number,
        required: true
    },
    quantityReserved: {
        type: Number,
    },
    price: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    supplierId:{
        type: String,
        required: true
    },
    supplierSKU: {
        type: String,
    },
    location: {
        type: String,
        required: true
    },
    reorderPoint: {
        type: Number,
        required: true
    },
    reorderQuantity: {
        type: Number,
        required: true
    },
    restockStatus: {
        type: String,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    lastRestockDate: {
        type: Date,
        required: true
    }
}, {timestamps: true})

export const Inventory = mongoose.model("Inventory", inventorySchema)