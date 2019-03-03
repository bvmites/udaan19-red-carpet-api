const mongoose = require('mongoose');
const _ = require('lodash');

var NomineeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category_name:{
            type:String,
            required:true
    },
    votes:{
        type:Number,
        default:0
    }
});

NomineeSchema.methods.toJSON = function () {
  var nominee = this;
  var nomineeObject = nominee.toObject();

  return _.pick(nomineeObject, ['name','category_name','votes']);
};

NomineeSchema.statics.getVoteSummary = function () {
    // var nominees=[];
    return Nominee.find()
    // return nominees;
}

var Nominee = mongoose.model('Nominee',NomineeSchema);

module.exports = {Nominee};