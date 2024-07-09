import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    seq: {
        type: Number,
        required: true
    }
})

export const Counter = mongoose.model("Counter", counterSchema)