const mongoose = require('mongoose');

var AdminSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    password:{
    	type:String,
        required:true
    }
});

var Admin = mongoose.model('Admin',AdminSchema);

module.exports = {Admin};
