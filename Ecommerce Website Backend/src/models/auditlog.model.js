import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    affectedResource:{
        type: String,
        required: true
    },
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    details: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String,
        required: true
    }
}, {timestamps: true})

export const AuditLog = mongoose.model("AuditLog", auditLogSchema)