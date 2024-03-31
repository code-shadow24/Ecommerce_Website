import mongoose from "mongoose"

const addressSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mobileNo :{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    AddressLine1 : {
        type: String,
        required: true,
    },
    AddressLine2 : {
        type: String,
    },
    City: {
        type: String,
        required: true
    },
    State: {
        type: String,
        required: true
    },
    Country : {
        type: String,
        required: true
    },
    Pincode: {
        type: Number,
        required: true
    }
}, {timestamps: true})

export const Address = mongoose.model("Address", addressSchema)