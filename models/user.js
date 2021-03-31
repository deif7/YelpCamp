const mongoose = require('mongoose');
const Schema = mongoose.Schema
const passLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email : {
    type: String,
    required : true,
    unique : true
    }
});

UserSchema.plugin(passLocalMongoose);

module.exports = mongoose.model('User', UserSchema)
