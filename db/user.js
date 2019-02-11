const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
            type:String,
            required:true,
    },
    voteStatus:[{
        type:Boolean,
        required:true,
    }]
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};