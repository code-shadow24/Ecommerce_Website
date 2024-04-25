import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    publishedAt: {
        type: Date,
        required: true
    },
    isPublished: {
        type: Boolean,
        required: true
    },
    isActive:{
        type: Boolean,
        required: true
    }
}, {timestamps: true})

export const Blog = mongoose.model("Blog", blogSchema);