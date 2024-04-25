import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    shipmentStatus: {
        type: String,
        required: true
    },
    carrierName: {
        type: String,
        required: true
    },
    trackingNumber: {
        type: String,
        required: true
    },
    shippingMethod: {
        type: String
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    shippingCost: {
        type: Number,
        required: true
    },
    estimatedDeliveryDate: {
        type: Date,
        required: true
    },
    actualDeliveryDate: {
        type: Date,
        required: true
    },
    shippingLabel: {
        type: String,
        required: true
    },
    packageWeight: {
        type: Number,
        required: true
    },
    packageDimensions: {
        length: {
            type: Number,
            required: true
        },
        breadth: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    },
    shippingNotes: {
        type: String,
    },
    returnShipment: {
        type: String
    }
},{timestamps:true})

export const Shipment = mongoose.model("Shipment", shipmentSchema)