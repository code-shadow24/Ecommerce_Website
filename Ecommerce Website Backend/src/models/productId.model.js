import mongoose from 'mongoose';

const productIdSchema = new mongoose.Schema({
    prefix: {
        type: 'string',
        default: 'POD'
    },
    current: {
        type: Number,
        default: 10000
    }
})

export const ProductId = mongoose.model('ProductId', productIdSchema)