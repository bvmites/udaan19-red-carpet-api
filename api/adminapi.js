const admin_router = require('express').Router();
const {admin_authenticate} = require('./../middleware/auth-admin');
const {Admin} = require('./../db/admin');
const {Nominee} = require('./../db/nominee');
const {User} = require('./../db/user');
const {Category} = require('./../db/category');
const {SHA256} = require('crypto-js');

admin_router.post('/nominee',admin_authenticate,(req,res)=>{
    if(req.admin){
        Category.find({
            name:req.body.category_name
        },(err,result)=>{
            console.log(result);
            if(result.length>0){
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

admin_router.post('/category',admin_authenticate,(req,res)=>{
    if(req.admin){
        var category = new Category({
           name: req.body.name
        });
        category.save().then((doc)=>{
            res.send(doc);
        },(e)=>{
            res.status(400).send(e);
        })
        
    }
});

// admin_router.get('/display',admin_authenticate,(req,res)=>{
//     if(req.admin){
//         Nominee.find().then((nominee)=>{
//             res.send(nominee);
//         }).catch((e)=>{
//             res.status(400).send();
//         })
//     }
// });

admin_router.post('/admin/login',(req, res) => {
  var body = req.body;
  Admin.findByCredentials(body.admin_id, body.password).then((admin) => {
    return admin.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(admin);
    });
  }).catch((e) => {
    res.status(400).send(e);
  });
});

admin_router.delete('/admin/logout', admin_authenticate, (req, res) => {
  req.admin.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

admin_router.post('/admin/addUser',admin_authenticate,(req,res)=>{
    if(req.admin){
        var user = new User({
            user_id:req.body.user_id,
            password:SHA256(req.body.user_id+process.env.GEN_SECRET).toString().substring(15,21)
        });
        res.status(200).send({
            "user_id":user.user_id,
            "password":user.password
        });
        user.save().then(()=>{
        }).catch((e)=>{
            res.status(400).send(e);
        })
    }
});

module.exports = {admin_router};