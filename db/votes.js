const mongoose = require('mongoose');

var VotesSchema = new mongoose.Schema({
    user_id:{
        type:String,
        required:true,
    },
    category_name:{
            type:String,
            required:true
    },
    nominee_name:{

        type:String,
        require:true
    }
});

var Votes = mongoose.model('Votes',VotesSchema);

module.exports = {Votes};