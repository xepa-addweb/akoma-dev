const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Settings = new Schema({
    server:  { type : String, required : true},
    port:  { type : String, required : true},
    auth_username : { type: String, required: true, unique: true, lowercase: true },
    auth_password : { type : String, required : true },
    from_address : { type : String, required : false}   

});
module.exports = mongoose.model('settings', Settings);