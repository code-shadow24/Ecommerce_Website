import mongoose from 'mongoose';

const orderIDSchema = new mongoose.Schema({
    prefix: {
        type: String,
        default: 'INP'
    },
    current: {
        type: Number,
        default: 10000
    }
});

export const OrderID = mongoose.model('OrderID', orderIDSchema);