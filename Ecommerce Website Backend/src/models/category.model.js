import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryame : {
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    image:{
        type : String,
    },
    slug: {
        type : String,
    },
    metaTitle: {
        type : String,
    },
    metaDescription: {
        type : String,
    },
    metaKeyword: {
        type : String,
    },
    subCategory: {
        type : String,
    }
},{timestamps: true,})


export const Category = mongoose.model("Category", categorySchema)