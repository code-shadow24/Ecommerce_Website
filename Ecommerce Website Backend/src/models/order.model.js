import mongoose from "mongoose";
import { OrderID } from "./orderId.model.js";

const quantitySchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        required: true
    },
    color: {
        type: String,
    },
    size: {
        type: String
    },
    returnQuantity: {
        type: Number
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
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    orderItem: [quantitySchema],
    discount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coupon"
    },
    tax: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tax"
    },
    status: {
        type: String,
        enum: ["Pending", "Cancelled", "Refunded", "Ready To Ship", "In-Transit", "Delivered", "RTO", "Return Created", "Return PickedUp", "Return In-Transit", "Return Cancelled" ,"Returned"],
        required: true
    },
    returnReason: {
        type: String,
    },
}, {timestamps: true})

orderSchema.pre('save', async function(next){
    if(!this.orderId){
        let orderIdRecord = await OrderID.findOne();
        if (!orderIdRecord) {
            orderIdRecord = new OrderID();
        }

        const orderId = `${orderIdRecord.prefix}${orderIdRecord.current}`;
        orderIdRecord.current += 1;
        await orderIdRecord.save();

        this.orderId = orderId;
    }

    next();
})

export const Order = mongoose.model("Order", orderSchema)