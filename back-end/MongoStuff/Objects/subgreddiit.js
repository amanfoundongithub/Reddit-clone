const mongoose = require('mongoose')

const pageSchema = new mongoose.Schema({
    name:{ // Name of the subGreddiit
        required:true, 
        unique:true, 
        type:String, 
    }, 
    description:{ // Description of the subGreddiit 
        default:'',
        type:String, 
    },
    profileImageURL:{ // Profile image of the subGreddiit that will be used everywhere
        default:'https://icon-library.com/images/yellow-discord-icon/yellow-discord-icon-15.jpg',
        type:String, 
    } ,
    coverImageURL:{ // Cover image for the subGreddiit 
        default:'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Solid_green.svg/1200px-Solid_green.svg.png',
        type:String, 
    }, 
    tags:{
        required:true, 
        type:[String],
    },
    bannedKeywords:{
        required:true, 
        type:[String],
    },
    // uSERS OF THE GREDDIIT ARE BEING LISTED BELOW , THEIR EMAILS OR IDS COULD BE USED 
    moderators:{
        // required:true, 
        type:[String]
    },
    followers:{
        // required:true,
        type:[String],
    },
    banned:{
        type:[String],
    },
    pending:{ // invites of pending user 
        type:[
            {
                username:String, 
                reason:String, 
                email:String,
            }
        ]
    },
    // sAVE POSTS OF THE GREDDIITS 
    posts:{
        type:[String]
    },

    // created on
    createdOn:{
        default: new Date(),
        type:Date,
    },
    // Keep track of the reports 
    reports:{
        type:[{
            reportedBy: String, // Email of the person who reported 
            reported: String,   // Email of the reported person 
            Concern: String,    // Relevant concern of report
            postID: String,     // ID of the post which is reported. 
            reportedOn: {
                type:Date, 
                default: new Date(),
            },
            blockButton:{
                type:Boolean,
                default:false,
            }
        }] 
    }
})

module.exports = pageSchema