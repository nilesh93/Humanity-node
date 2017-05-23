const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

let Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    name: String,
    email: String,
    points: { type: Number, default: 0 },
    total_points: { type: Number, default: 0 },
    total_donations: { type: Number, default: 0 },
    join_date: { type: Date, default: Date.now },
    img: String,
    facebook: { type: String, default: null },
    google: { type: String, default: null },
    advertisements_pending: []
})
    .plugin(mongoosePaginate));