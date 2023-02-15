const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        firstname:String,
        lastname:String,
    },
    gender: {
        type:String
    },
    username:
    {
        type:String,
        required: true,
        unique: true, 

    },
    dob:
    {
        type:Date,
        required: true,
        
        
    },
    membersince:
    {
        type:Date ,
        // required: true,
        default: new Date() 
        
    },
    email:
    {
        type:String,
        required: true,
        unique: true, 
        
    },
    password:{
        type:String,
        required: true,
        
        
    },
    phone:{
        type:Number,
        required: true, 
        
    },
    followers:[String],
    following:[String], 

    about:{
        type:String,
        default:'',
    },
    created:[],
    joined:[],
    imageurl:{
        type:String, 
        default:'https://qph.cf2.quoracdn.net/main-qimg-73e139be8bfc1267eeed8ed6a2802109-lq'
    },
    savedPosts:[String],
})



module.exports = userSchema 

