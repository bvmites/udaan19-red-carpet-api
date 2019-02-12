const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {mongoose} = require('./db/mongoose');
const {Admin} = require('./db/admin');
const {Nominee} = require('./db/nominee');
const {User} = require('./db/user');
const {Category} = require('./db/category');
const {Votes} = require('./db/votes');
const {user_authenticate} = require('./middleware/auth-user');
const {admin_authenticate} = require('./middleware/auth-admin');
var app = express();
app.use(bodyParser.json());

app.post('/nominee',(req,res)=>{
    var nominee = new Nominee({
       name: req.body.name,
       category_name:req.body.category_name
    });
    nominee.save().then((doc)=>{
        res.send(doc);
    },(e)=>{    
        res.status(400).send(e);
    })
});

app.post('/category',(req,res)=>{
    var category = new Category({
       name: req.body.name
    });
    category.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    })
});

app.post('/votes',(req,res)=>{
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
    })
});

app.get('/display',(req,res)=>{
    Nominee.find().then((nominee)=>{
        res.send(nominee);
    }).catch((e)=>{
        res.status(400).send();
    })
});

app.post('/user/login',(req, res) => {
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

app.delete('/user/me/logout', user_authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});


app.post('/admin/login',(req, res) => {
  // var body = _.pick(req.body, ['user_id', 'password']);
  var body = req.body;
  Admin.findByCredentials(body.admin_id, body.password).then((admin) => {
    return admin.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(admin);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

app.delete('/admin/me/logout', admin_authenticate, (req, res) => {
  req.admin.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

app.listen(3000,()=>{
    console.log('Server is upto 3000');
})