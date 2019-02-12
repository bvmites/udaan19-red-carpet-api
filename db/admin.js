const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
// const validator = require('validator');
const jwt = require('jsonwebtoken');

var AdminSchema = new mongoose.Schema({
    admin_id:{
        type:String,
        unique:true,
        required:true
    },
    password:{
    	type:String,
        required:true
    },
    token:{
        type:String,
    }
});

AdminSchema.methods.generateAuthToken = function () {
  var admin = this;
  var token = jwt.sign({_id: admin._id.toHexString()},'abc123').toString(); // process.env.JWTTOKEN

  admin.token=token;

  return admin.save().then(() => {
    return token;
  });
};

AdminSchema.statics.findByCredentials = function (admin_id, password) {
  var Admin = this;

  return Admin.findOne({admin_id}).then((admin) => {
    if (!admin) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and admin.password
      bcrypt.compare(password, admin.password, (err, res) => {
        if (res) {
          resolve(admin);
        } else {
          reject();
        }
      });
    });
  });
};

AdminSchema.statics.findByToken = function (token) {
  var Admin = this;
  var decoded;

  try {
    decoded = jwt.verify(token,'abc123'); // process.env.JWT_SECRET
  } catch (e) {
    return Promise.reject();
  }

  return Admin.findOne({
    '_id': decoded._id,
    'token': token
  });
};

AdminSchema.methods.removeToken = function (token) {
  var admin = this;

  return admin.update({
    $set: {
      token:null
    }
  });
};


AdminSchema.pre('save', function (next) {
  var admin = this;

  if (admin.isModified('password')) {
    bcrypt.genSalt(10, function (err, salt)  {
      bcrypt.hash(admin.password, salt, function (err, hash){
        admin.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var Admin = mongoose.model('Admin',AdminSchema);
var admin = new Admin({
	admin_id:"Nikunj",
	password:"abcdef"
});
admin.save();
// Admin.insertMany(admin).then(()=>{}).catch((e)=>console.log(e));

module.exports = {Admin};
