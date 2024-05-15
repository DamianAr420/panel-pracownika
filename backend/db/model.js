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
        do: String,
    }],
    role: {
        type: String,
    },
    tel: {
        type: String,
    },
    email: {
        type: String,
    },
    stanowisko: {
        type: String,
    },
    umowa: {
        type: String,
    },
}, { collection: 'pracownicy' });

const User = mongoose.model('User', UserSchema);

module.exports = User;