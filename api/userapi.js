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
        var temp = req.user.voteStatus.filter((obj)=>obj.category_name===req.body.category_name);
        if(temp[0].isVoted===false){
            var votes = new Votes({
               user_id: req.body.user_id,
               category_name: req.body.category_name,
               nominee_name: req.body.nominee_name
            });
            votes.save().then((doc)=>{
                res.send(doc);
            },(e)=>{
                res.status(400).send(e);
            });
            Nominee.findOne({
                name:votes.nominee_name,
                category_name:votes.category_name
            },(err,result)=>{
                if(result){
                    result.votes=result.votes+1;
                    result.save().then(()=>{}).catch((e)=>console.log(e));
                }
            });
            User.findOne({
                user_id:req.body.user_id
            },(err,result)=>{
                if(result){
                    result.voteStatus.forEach((category_vote)=>{
                        if(category_vote.category_name===temp[0].category_name)
                            category_vote.isVoted=true
                    });
                    result.save().then(()=>{}).catch((e)=>console.log(e));
                }
            })
        } else {
            console.log(`You have already voted in the ${temp[0].category_name} category.`);
            res.status(400).send();
        }
    }
});

module.exports= {router1};