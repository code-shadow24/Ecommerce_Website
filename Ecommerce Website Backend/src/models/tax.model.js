import mongoose from "mongoose";

const taxSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    region:{
        type: String,
        required: true,
    },
    taxType: {
        type: String,
        required: true,
    },
    isDefault:{
        type: Boolean,
        required: true,
    }
},{timestamps: true})

export const Tax = mongoose.model("Tax", taxSchema)