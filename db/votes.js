const mongoose = require('mongoose');

var VotesSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    // category_name:{
    //         type:String,
    //         required:true
    // },
    // nominee_name:{
    //     type:String,
    //     require:true
    // }
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

var Votes = mongoose.model('Votes',VotesSchema);

module.exports = {Votes};