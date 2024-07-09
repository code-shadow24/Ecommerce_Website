import mongoose from "mongoose";

const crmticketSchema = new mongoose.Schema({
    ticketid: {
        type: String,
        required: true,
        unique: true,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Open', 'Pending with Seller', 'Pending With Consumer', 'Duplicate', 'Closed'],
        required: true
    },
    category: {
        type: String,
        enum: ['Return', 'Not Shipped', 'Delay in Delivery', 'Cancelled but Not Refunded', 'Refunded but refund not received'],
        required: true
    },
    
    closedAt:{
        type: Date,
    },
    replies: {
        type: Array
    },
    replierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
},{timestamps:true})

export const CrmTicket = mongoose.model("CrmTicket", crmticketSchema)