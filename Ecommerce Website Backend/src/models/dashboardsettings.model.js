import mongoose from "mongoose";

const dashboardSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    layout: {
        type: String,
        required: true
    },
    theme: {
        type: String,
        required: true
    },
    widgets: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

export const Dashboard = mongoose.model("Dashboard", dashboardSchema)