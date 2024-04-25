import mongoose from "mongoose"

const subcategorySchema = new mongoose.Schema({
    subcategoryName:{
        type: String,
    },
    description:{
        type: String,
    },
    image: {
        type: String,
    },
    slug: {
        type: String,
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
    category: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
},{timestamps: true})

export const Subcategory = mongoose.model("Subcategory", subcategorySchema)