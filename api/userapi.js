const router1 = require('express').Router();
const {user_authenticate} = require('./../middleware/auth-user');
const {User} = require('./../db/user');
const {Votes} = require('./../db/votes');
const {Nominee} = require('./../db/nominee');

router1.post('/user/login',(req, res) => {
  // var body = _.pick(req.body, ['user_id', 'password']);
  var body = req.body;
  User.findByCredentials(body.user_id, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

router1.delete('/user/logout', user_authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

router1.post('/votes',user_authenticate,(req,res)=>{
    if(req.user){
        if(req.user.voteStatus===false){
            var votes = new Votes({
               user_id: req.body.user_id,
               myVotes: req.body.myVotes
            });
            votes.save().then((doc)=>{
                res.send(doc);
            },(e)=>{
                res.status(400).send(e);
            });

            votes.myVotes.forEach((vote)=>{
            	// console.log('Yes');
            	Nominee.findOne({
	                name:vote.nominee_name,
	                category_name:vote.category_name
	            },(err,result)=>{
	                if(result){
	                    result.votes=result.votes+1;
	                    result.save().then(()=>{}).catch((e)=>console.log(e));
	                }
	            });
            })

            User.findOne({
                user_id:req.body.user_id
            },(err,result)=>{
                if(result){
                    result.voteStatus = true;
                    result.save().then(()=>{}).catch((e)=>console.log(e));
                }
            })
        } else {
            console.log(`You have already voted.`);
            res.status(400).send();
        }
    }
});

module.exports= {router1};