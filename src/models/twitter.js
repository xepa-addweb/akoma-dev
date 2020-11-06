const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

let Twitter = new Schema({
    key: { type: String, required: true},
    access_key: { type: String, required: true }
});

module.exports = mongoose.model('twitter', Twitter);