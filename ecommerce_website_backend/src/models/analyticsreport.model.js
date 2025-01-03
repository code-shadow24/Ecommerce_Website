import mongoose, { Mongoose } from "mongoose";

const analyticsreportSchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin"
    },
    reportType: {
        type: String
    },
    metrics: {
        type: Array
    },
    visualizationType: {
        type: String
    },
    filters : {
        type: Array
    },
    data: {
        type: Array
    },
    expiresAt: {
        type: Date
    },
    isActive: {
        type: Boolean
    },
    fileUrl: {
        type: String
    }
})

export const Analyticsreport = mongoose.model("Analyticsreport", analyticsreportSchema)