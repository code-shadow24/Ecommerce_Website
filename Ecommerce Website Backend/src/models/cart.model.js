import mongoose from "mongoose";

const quantitySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    }
})

const cartSchema = new mongoose.Schema({
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
    productImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    addedQuantity: [quantitySchema],
    price: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    deliveryCharge: {
        type: Number,
        required: true
    },
    coupon: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon"
        }
    ],
    grandTotal: {
        type: Number,
        required: true
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productUrl: {
        type: String,
        required: true
    },
    productAvailability: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true
    },
    totalQuantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    discountAmount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    },
    tax: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tax",
        required: true
    }
});

export const Cart = mongoose.model("Cart", cartSchema);