var express = require('express')
let cors = require('cors') 
let http = require('http')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken') // need for token authentication 
const { dbConnect, connectToUser } = require('./MongoStuff/Connection/connection');

// Socket.io server 
const {Server} = require('socket.io')

const userSchema = require('./MongoStuff/Objects/user');
const signup = require('./routes/signup') 
const userdata = require('./routes/userdata')
const gre = require('./routes/sub_manage')
const pageSchema = require('./MongoStuff/Objects/subgreddiit');
const post = require('./routes/post_manage')

dbConnect() 


const user = mongoose.model("User",userSchema) 
const gr = mongoose.model("Greddiits",pageSchema)

var app = express();
app.use(express.json())
app.use(cors()) 


app.use('/signin',signup) 
app.use('/userdata',userdata) 
app.use('/gr',gre) 
app.use('/post',post)  // All url redirected to post 


// Now create a http server
const server = http.createServer(app) 

server.listen(4001,()=>{
    console.log("Server is running at port 4001") 
})

// Now create a socket.io server
const io = new Server(server,{
    cors:{
        origin:'http://localhost:3000',

    }
})


// listen to the event with name "connection" 
io.on('connection',(socket)=>{
    console.log("id: ",socket.id) 

    // Connect to the room 
    socket.on('join_room',(data)=>{
        socket.join(data) 
        console.log("Connected to the room") 
        console.log("user: ",socket.id," has joined the room!!! uWU")
    })

    // Send a message to a room 
    socket.on('send_message',(data)=>{
        console.log("SENT BY ",data.author," at ",data.time) 
        socket.to(data.room).emit('get_message',data) 
    })
    // Disconnect from the server
    socket.on('disconnect',()=>{
        console.log("User disconnected - Server.io server")
    })
})

app.listen(4000)

