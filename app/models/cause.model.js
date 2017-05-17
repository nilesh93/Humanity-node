const mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('Cause', new Schema({
    title: String,
    description: String,
    contact: String,
    img: String,
    target: Number,
    date_created: { type: Date, default: Date.now },
    recieved: { type: Number, default: 0 }
}));