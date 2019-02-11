const mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
});

var Category = mongoose.model('Category',CategorySchema);

module.exports = {Category};

