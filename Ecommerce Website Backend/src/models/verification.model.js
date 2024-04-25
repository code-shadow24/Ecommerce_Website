import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    },
    verificationStatus: {
        type: String,
        required: true
    },
    verificationCode: {
        type: String,
        required: true
    },
    verificationToken: {
        type: String,
        required: true
    },
    documentUpload:{
        aadhaarCardImage: {
            type: String,
            required: true
        },
        aadharCardNumber: {
            type: Number,
            required: true
        },
        panCardNumber: {
            type: Number,
            required: true
        },
        panCardImage: {
            type: String,
            required: true
        },
        bankAccountNumber: {
            type: String,
            required: true
        },
        bankAccountNumberImage: {
            type: String,
            required: true
        }
    },
    businessDocument: {
        businessRegistrationNumber: {
            type: String,
            required: true
        },
        businessRegistrationNumberImage: {
            type: String,
            required: true
        },
        GSTnumber: {
            type: String,
            required: true
        },
        GSTregistrationProof: {
            type: String,
            required: true
        },
        license: {
            type: String,
        }
    },
    businessProfile: {
        businessName: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        website: {
            type: String,
            required: true
        },
        products:[
            {
                type: String,
                required: true
            }
        ]
    }
})

export const Verification = mongoose.model("Verification", verificationSchema)