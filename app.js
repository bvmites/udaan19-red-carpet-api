const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {Admin} = require('./db/admin');
const {Nominee} = require('./db/nominee');
const {User} = require('./db/user');
const {Category} = require('./db/category');
const {Votes} = require('./db/votes');
const app = express();
app.use(bodyParser.json());

app.post('/nominee',(req,res)=>{
    // res.send('Hello There!');
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
    // res.send('Running');
    var category = new Category({
       name: req.body.name
    });
    category.save().then((doc)=>{
        res.send(doc);
    },(e)=>{
        res.status(400).send(e);
    })
    // res.send('Hello There!');
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
            result.save();
        }
        // if(result){
        //     result.votes=result.votes+1;
        //     res.send(result);
        // }
        // else
        //     res.status(400).send();
    })
    // res.send('Hello There!');
});

app.get('/display',(req,res)=>{
    Nominee.find().then((nominee)=>{
        res.send(nominee);
    }).catch((e)=>{
        res.status(400).send();
    })
    // res.send('Hello There!');
});

app.listen(3000,()=>{
    console.log('Server is upto 3000');
})