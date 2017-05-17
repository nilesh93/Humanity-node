const mongoose = require('mongoose');
let Schema = mongoose.Schema;

module.exports = mongoose.model('Donation', new Schema({
    _user: { type: Schema.Types.ObjectId, ref: 'User' },
    _cause: { type: Schema.Types.ObjectId, ref: 'Cause' },
    amount: Number,
    date: { type: Date, default: Date.now }
}));