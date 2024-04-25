import mongoose from "mongoose";

const analyticsreportSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    reportType: {
        type: String,
        required: true
    },
    metrics: {
        type: Array,
        required: true
    },
    visualizationType: {
        type: Array,
        required: true
    },
    filters: {
        type: Array
    },
    data: {
        type: String,
        required: true
    },
    generatedAt: {
        type: Date,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    }
},{timestamps: true})

export const AnalyticsReport = mongoose.model("AnalyticsReport", analyticsreportSchema)