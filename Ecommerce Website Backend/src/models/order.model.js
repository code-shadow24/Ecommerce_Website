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

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true
    },
    orderPrice: {
        type: Number,
        required: true,
    },
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productTitle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    orderItem: [quantitySchema],
    size: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    productPrice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    productImage: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ] 
    },
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    },
    tax: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tax"
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller"
    },
    status: {
        type: String,
        enum: ["Pending", "Cancelled", "Refunded", "Ready To Ship", "In-Transit", "Delivered", "RTO"],
        required: true
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)