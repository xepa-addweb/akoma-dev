const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Client = new Schema({
    company_name:  { type : String, required : true},
    email : { type: String, required: true, unique: true, lowercase: true },
    website : { type : String, required : false },
    address : { type : String, required : false},
    phone : { type : String, required : false},
    company_logo : { type : String, required : false } 

});
module.exports = mongoose.model('clients', Client);