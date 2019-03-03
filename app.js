const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const http = require('http')

const {mongoose} = require('./db/mongoose')
const {Admin} = require('./db/admin')
const {Nominee} = require('./db/nominee')
const {User} = require('./db/user')
const {Category} = require('./db/category')
const {Votes} = require('./db/votes')

const {user_authenticate} = require('./middleware/auth-user')
const {admin_authenticate} = require('./middleware/auth-admin')

const {admin_router} = require('./api/adminapi')
const {user_router} = require('./api/userapi')

var app = express()
app.use(bodyParser.json())

var server = http.createServer(app)
var io = socketIO(server)

app.use('/',admin_router)
app.use('/',user_router)
// app.use(express.static(__dirname+'/public'))

io.on('connection', (socket) => {
	console.log('New connection')

    Nominee.getVoteSummary().then((result)=>{
    	socket.emit('display', result);	
    });
    
    socket.on('disconnect',()=>{
    	console.log('User disconnected')
    })
});

const port = process.env.PORT
server.listen(port,()=>{
    console.log(`Server is running on port ${port}.`)
})