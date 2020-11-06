const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let Client = new Schema({
    company_name:  { type : String, required : true},
    client_name:  { type : String, required : true},
    email : { type: String, required: true, unique: true, lowercase: true },
    website : { type : String, required : true },
    address : { type : String, required : false},
    phone : { type : String, required : true},
    company_logo : { type : String, required : false } ,
    country_code : { type : String, required : true },
    client_admin: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: false }],
    twitter_consumer_key : { type : String, required : false},
    twitter_consumer_secret : { type : String, required : false},
    twitter_access_token : { type : String, required : false},
    twitter_access_token_secret : { type : String, required : false}    

});
module.exports = mongoose.model('clients', Client);