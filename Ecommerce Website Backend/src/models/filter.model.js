import mongoose from "mongoose";

const filterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true
    },
    results:[
        {
            type: String,
            required: true
        }
    ],
    isActive: {
        type: Boolean,
        required: true
    }
},{timestamps: true})

export const Filter = mongoose.model("Filter", filterSchema)