var express = require('express')
let cors = require('cors') 
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken') // need for token authentication 
const { dbConnect, connectToUser } = require('./MongoStuff/Connection/connection');



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

app.listen(4000)

