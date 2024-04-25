import mongoose from "mongoose";

const searchSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    query: {
        type: String,
        required: true
    },
    result:[
        {
            type: Array,
            required: true
        }
    ],
    isActive:{
        type: Boolean,
        required: true
    }
},{timestamps: true});

export const Search = mongoose.model("Search", searchSchema);