const mongoose = require('mongoose');
const _ = require('lodash');

var VotesSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    myVotes:[{
        category_name:{
            type:String
        },
        nominee_name:{
            type:String
        }
    },{
        category_name:{
            type:String
        },
        nominee_name:{
            type:String
        }
    }]
});

VotesSchema.methods.toJSON = function () {
  var votes = this;
  var myVote1 = votes.myVotes[0];
  myVote1=_.pick(myVote1,['category_name','nominee_name']);
  var myVote2 = votes.myVotes[1];
  myVote2=_.pick(myVote2,['category_name','nominee_name']);
  return {
    "user_id":votes.user_id,
    "voted_for":[myVote1,myVote2]
  };
};

var Votes = mongoose.model('Votes',VotesSchema);

module.exports = {Votes};