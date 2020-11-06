const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Settings = new Schema({
    subject:  { type : String, required : true},
    content:  { type : String, required : false}

});
module.exports = mongoose.model('templates', Settings);