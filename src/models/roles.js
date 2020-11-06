const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let roleSchema = new Schema({
    name: { type: String, required: true, unique: true },
    normalized: String,
    description: String,
    grants: [{ type: String, required: true }],
    

});
module.exports = mongoose.model('roles', roleSchema);