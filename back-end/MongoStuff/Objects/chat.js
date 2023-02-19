const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    // _id will be the room 
    participants:[String], // participants in chat

    messages:[{
            room: String, 
            author: String, 
            message: String, 
            time: String, 
    }]

    // Bas khatam 
})

module.exports = chatSchema