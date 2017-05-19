const mongoose = require('mongoose');

let Schema = mongoose.Schema;

module.exports = mongoose.model('Company', new Schema({
    name: String,
    email: String,
    password: String,
    address: String,
    contact: String,
    img: String
}));