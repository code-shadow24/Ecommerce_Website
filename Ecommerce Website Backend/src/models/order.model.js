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
    orderPrice: {
        type: Number,
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
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
    productImage: {
        type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ] 
    },
    status: {
        type: String,
        enum: ["Pending", "Cancelled", "Refunded", "Ready To Ship", "In-Transit", "Delivered", "RTO"],
        required: true
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)