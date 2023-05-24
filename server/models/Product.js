const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true
    },
    date: {
        type: String,
        required: true
    }
});

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    expdate: {
        type: String,
        required: true
    },
    tags: {
        type: String,
        required: true
    },
    alltheprices: [PriceSchema]
});

module.exports = Product = mongoose.model('product', ProductSchema);
