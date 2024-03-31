import mongoose from "mongoose"

const subcategorySchema = new mongoose.Schema({
    subcategory:{
        type: String,
    },
    category: {
        type : mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
})

export const Subcategory = mongoose.model("Subcategory", subcategorySchema)