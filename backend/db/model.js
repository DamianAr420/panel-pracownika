const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: {
        type: String,
    },
    password: {
        type: String,
    },
    imie: {
        type: String,
    },
    nazwisko: {
        type: String,
    },
    zmiany: [{
        data: String,
        od: String,
        do: String
    }],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;