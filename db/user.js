const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    user_id:{
        type:String,
        unique:true,
        required:true
    },
    password:{
            type:String,
            required:true,
    },
    voteStatus:{
      type:Boolean,
      default:false
    },
    token:{
        type:String,
    }
});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var token = jwt.sign({_id: user._id.toHexString()},process.env.JWT_SECRET).toString();

  user.token=token;

  return user.save().then(() => {
    return token;
  });
};

UserSchema.statics.findByCredentials = function (user_id, password) {
  var User = this;

  return User.findOne({user_id}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token,process.env.JWT_SECRET);
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'token': token
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $set: {
      token:null
    }
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

UserSchema.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ['user_id']);
};

var User = mongoose.model('User',UserSchema);

module.exports = {User};