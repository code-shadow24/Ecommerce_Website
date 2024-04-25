import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    isGlobal: {
        type: Boolean,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
},{timestamps: true})

export const Permission = mongoose.model("Permission", permissionSchema)