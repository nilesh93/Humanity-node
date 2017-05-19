const mongoose = require('mongoose');

let Schema = mongoose.Schema;


module.exports = mongoose.model('Advertisement', new Schema({
    title: String,
    description: String,
    start_date: { type: Date, default: Date.now },
    expiration_date: Date,
    views: { type: Number, default: 0 },
    total_views: { type: Number, default: 0 },
    price_per_view: Number,
    max_views: Number,
    _company: { type: Schema.Types.ObjectId, ref: 'Company' },
    video_url: String,
    expiration_buffer: { type: Number, default: 360 } //this should be in seconds
}));