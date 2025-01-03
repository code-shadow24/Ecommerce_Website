import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    fullname : {
        firstName :{
            type: String,
            required: true
        },
        lastName :{
            type: String,
            required: true
        }
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String, 
        required: true
    },
    refreshToken: {
        type: String,
    },
    mobileNumber: {
        type: Number
    }

}, {timestamps: true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 14)
    next()
})

userSchema.methods.passwordCheck = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.accessTokenGenerator = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        {
            expiresIn: process.env.ACCESS_SECRET_TOKEN_EPIRY
        }
    )
}

userSchema.methods.refreshTokenGenerator = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_SECRET_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_SECRET_TOKEN_EPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema);