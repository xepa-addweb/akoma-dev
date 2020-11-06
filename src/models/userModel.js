const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Schema = mongoose.Schema;

let User = new Schema({
first_name: {type: String, required: true},
last_name: {type: String, required: true},
email: {type: String, required: true, unique: true, lowercase: true},
password: { type: String, required : false },
status: {type: String, required: false},
username: {type: String, required: true, unique: true},
role: { type: mongoose.Schema.Types.ObjectId, ref: 'roles', required: false, autopopulate : true },
profile_image: {type: String, required: false},
is_password_set: {type: Boolean, required: false},
client : [{ type: mongoose.Schema.Types.ObjectId, ref: 'clients', required: false, autopopulate : true }],
})
User.plugin(require('mongoose-autopopulate'))

User.statics.updatePassword = function (userid,data,callback) {
    var userpass = data.password;
    var is_password_set = data.is_password_set
    var self = this;   
  
      bcrypt.hash(userpass, saltRounds, function (err, hash) {
        if (err) return next(err)
  
        userpass = hash;
  
        return self.model('users').updateOne(
          {
            _id:userid
          },
          {
            $set:
              {
                password: userpass,
                is_password_set : is_password_set
              }
          },callback)
  
        })
    
  }

User.statics.isCorrectPassword = function(password, hased, callback){
// console.log("yes came")
// console.log(password)
// console.log(this.password)
bcrypt.compare(password, hased, function(err, same) {
  // console.log('COmpare')
    if (err) {
      // console.log(err)
    callback(err);
    } else {
    callback(err, same);
    }
});
}  
module.exports = mongoose.model('users', User);