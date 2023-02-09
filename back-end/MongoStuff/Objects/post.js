const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    // Title of the post
    title:{
        required:true, 
        type:String, 
    }, 
    // Content of the post 
    content:{
        required:true, 
        type:String, 
    }, 
    // Creation date 
    createdAt:{
        type:Date, 
        default: new Date(),
    }, 
    // Created by whom stores email address 
    createdBy:{
        type:String, 
        required:true, 
    },
    // Upvotes 
    upvotes:{
        type:[String], 
    },
    // downvotes 
    downvotes:{
        type:[String] 
    },
    // comments
    comments:[{
        body:String, 
        by:String, 
        upvotes:[String],
        downvotes:[String],
    }],
    
})

module.exports = postSchema