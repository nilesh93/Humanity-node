const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

module.exports = mongoose.model('Cause', new Schema({
    title: String,
    description: String,
    contact: String,
    img: String,
    target: Number,
    date_created: { type: Date, default: Date.now },
    recieved: { type: Number, default: 0 },
    watching: { type: Number, default: 0 },
    watched_by: []
})
    .plugin(mongoosePaginate));