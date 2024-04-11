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
    Price: {
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
    coupon: {
        type: String,
    },
    grandTotal: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

export const Cart = mongoose.model("Cart", cartSchema);