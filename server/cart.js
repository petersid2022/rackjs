const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    }, 
    { 
        collection: 'cart' 
    }
);

mongoose.model('cart', CartSchema);
