const dotenv = require('dotenv')
dotenv.config()
const express = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const {Admin} = require('./db/admin');
const {Nominee} = require('./db/nominee');
const {User} = require('./db/user');
const {Category} = require('./db/category');
const {Votes} = require('./db/votes');
const {user_authenticate} = require('./middleware/auth-user');
const {admin_authenticate} = require('./middleware/auth-admin');
const {admin_router} = require('./api/adminapi');
const {user_router} = require('./api/userapi');
const port = process.env.PORT;

var app = express();
app.use(bodyParser.json());

app.use('/',admin_router);
app.use('/',user_router);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}.`);
})