import mongoose from "mongoose";

const settingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    typeoSettings: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    options: {
        type: Array,
        required: true
    },
    isRequired:{
        type: Boolean,
        required: true
    },
    defaultValue: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    }
}, {timestamps: true})

export const Settings = mongoose.model("Settings", settingSchema)