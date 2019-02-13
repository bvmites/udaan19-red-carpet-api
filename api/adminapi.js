const router = require('express').Router();
const {admin_authenticate} = require('./../middleware/auth-admin');
const {Admin} = require('./../db/admin');
const {Nominee} = require('./../db/nominee');
const {User} = require('./../db/user');
const {Category} = require('./../db/category');

router.post('/nominee',admin_authenticate,(req,res)=>{
    if(req.admin){
        // console.log('token');
        // console.log(req.body.category_name);
        Category.find({
            name:req.body.category_name
        },(err,result)=>{
            console.log(result);
            if(result.length>0){
                // console.log('Yes');
                var nominee = new Nominee({
                   name: req.body.name,
                   category_name:req.body.category_name
                });
                nominee.save().then((doc)=>{
                    res.send(doc);
                },(e)=>{    
                    res.status(400).send(e);
                });
            } else {
                res.status(400).send();
            }
        })
    }  
});        

router.post('/category',admin_authenticate,(req,res)=>{
    if(req.admin){
        var category = new Category({
           name: req.body.name
        });
        category.save().then((doc)=>{
            res.send(doc);
            // User.addVoteStatus(category.name);
        },(e)=>{
            res.status(400).send(e);
        })
        
    }
});

router.get('/display',admin_authenticate,(req,res)=>{
    if(req.admin){
        Nominee.find().then((nominee)=>{
            res.send(nominee);
        }).catch((e)=>{
            res.status(400).send();
        })
    }
});

router.post('/admin/login',(req, res) => {
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

router.delete('/admin/logout', admin_authenticate, (req, res) => {
  req.admin.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

router.post('/admin/addUser',admin_authenticate,(req,res)=>{
    if(req.admin){
        console.log('Yes');
        var user = new User({
            user_id:req.body.user_id,
            password:req.body.password,
            voteStatus:[{
                category_name:'Face of the Year',
                isVoted:false
            },{
                category_name:'Sport Person of the Year',
                isVoted:false
            }]
        });
        user.save().then((doc)=>{
            res.send(doc);
        }).catch((e)=>{
            res.status(400).send(e);
        })
    }
});

module.exports = {router};