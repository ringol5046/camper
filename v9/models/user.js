var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchame = new mongoose.Schema({
    username: String,
    password: String
});

userSchame.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchame);