const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: { type: String, unique: true, required: true },
    password: String,
    admincode: String,
    userType: String,
    }, 
    { 
        collection: 'user' 
    }
);


mongoose.model('user', UserSchema);
