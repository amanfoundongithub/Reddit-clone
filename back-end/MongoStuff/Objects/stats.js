const mongoose = require('mongoose')

const statSchema = new mongoose.Schema({
    // Name of the SubGreddiit 
    name: {
        type: String, 
        required:true, 
    },
    // Date of stat creation
    dateOfCreation:{
        type:Date, 
        default: new Date(),
    },
    // Check how many visits have happened to the subgreddiit on that day 
    visits:{
        type:[String], 
    },
    // Added numbers in the followers over the time
    followers:{
        type:[String],
    },
    // Number of daily posts 
    posts:{
        type:Number, 
        default: 0,
    },
})


module.exports = statSchema 
