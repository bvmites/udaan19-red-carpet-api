const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {Category} = require('./db/category');
var app = express();
app.use(bodyParser.json());

app.post('/nominee',(req,res)=>{
    // res.send('Hello There!');
    // var
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
    res.send('Hello There!');
});

app.get('/display',(req,res)=>{
    res.send('Hello There!');
});

app.listen(3000,()=>{
    console.log('Server is upto 3000');
})