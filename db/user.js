const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    // voteStatus:[{
    //     category_name:{
    //         type:String
            
    //     },isVoted:{
    //         type:Boolean
    //     }
    // },{
    //     category_name:{
    //         type:String
            
    //     },isVoted:{
    //         type:Boolean
    //     }
    // }],
    voteStatus:{
      type:Boolean
    },
    token:{
        type:String,
    }

});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var token = jwt.sign({_id: user._id.toHexString()},'abc123').toString(); // process.env.JWTTOKEN

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
    decoded = jwt.verify(token,'abc123'); // process.env.JWT_SECRET
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'token': token
  });
};

// UserSchema.statics.addVoteStatus = function (name) {
//     var User = this;
//     // console.log('in update');
//     User.updateMany({
//         __v:0
//     },{  
//             $push:{
//                 voteStatus:{
//                     category_name:name,
//                     isVoted:false
//                 }
//             }
//         })
// }

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

var User = mongoose.model('User',UserSchema);

var user=[new User({
    user_id:"16cp063",
    password:"abcdef",
    voteStatus:false
}),new User({
    user_id:"16cp043",
    password:"abcdef",
    voteStatus:false
})]

user[0].save().then(()=>{

}).catch(()=>{
  // console.log();
});
user[1].save().then(()=>{

}).catch(()=>{
  // console.log();
});
// User.insertMany(user).then(()=>{}).catch((e)=>console.log(e));

module.exports = {User};



