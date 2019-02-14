const mongoose = require('mongoose');
const _ = require('lodash');

var CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
});

CategorySchema.methods.toJSON = function () {
  var category = this;
  var categoryObject = category.toObject();

  return _.pick(categoryObject, ['name']);
};

var Category = mongoose.model('Category',CategorySchema);

module.exports = {Category};