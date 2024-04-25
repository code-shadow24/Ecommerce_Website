import mongoose from "mongoose";

const crmticketSchema = new mongoose.Schema({
    ticketid: {
        type: String,
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
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    assignedTo: {
        type: String,
    },
    isActive: {
        type: Boolean,
        required: true
    },
    closedAt:{
        type: Date,
    }
},{timestamps:true})

export const CrmTicket = mongoose.model("CrmTicket", crmticketSchema)