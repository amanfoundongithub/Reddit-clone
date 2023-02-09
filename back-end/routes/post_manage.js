const express = require('express')
const mongoose = require('mongoose')
const pageSchema = require('../MongoStuff/Objects/subgreddiit')
const { dbConnect } = require('../MongoStuff/Connection/connection')
const jwt = require('jsonwebtoken') 
const userSchema = require('../MongoStuff/Objects/user')

const postSchema = require('../MongoStuff/Objects/post')

require('dotenv').config() 


const router = express.Router()

router.use(express.json())

const gr = mongoose.model("Greddiits",pageSchema) 

const user = mongoose.model("User",userSchema) 

const post = mongoose.model("Posts",postSchema)


// Authenticate token
const authenticateToken = (req)=>{
    const token = req.body.token 

    if(token)
    {
        var result = false 
        jwt.verify(token.split(' ')[1],process.env.SECRET_TOKEN,(err,data)=>{
            if(err)
            {
                return 
            }

            req.newit = data 

            result = true 
        }) 


        if(result)
        {
            return {
                message:'OK',
                id:req.newit.id,
                username: req.newit.username,
                email:req.newit.email,
            }
        }
        else 
        {
            return{
                message:'NOT OK',
            }
        }
    }
    else 
    {
        return{
            message:'NO TOKEN'
        }
    }
}


// CREATE A POST FOR THE DESIRED TITLE AND THE DESCRIPTION 
router.route('/create').post((req,res,next)=>{

    const result = authenticateToken(req)

    const title = req.body.title 

    const body = req.body.body

    const name = req.body.name 

    const power = new post({
        title:title,
        content:body, 
        createdBy:result.email, 
    })

    power.save().then((response)=>{
        gr.findOne({
            name:name, 
        }).then((val)=>{
            val.posts.push(response._id)

            val.save().then(()=>{
                res.send({
                    created:true, 
                })
            }).catch((err)=>{
                console.log("Error: ",err)
                res.send({
                    created:false, 
                })
            })
            
        }).catch((err)=>{
            console.log("ERROR IN SAVING ")
            console.log(err) 
        })
    }).catch((err)=>{
        console.log("ERROR IN CREATING POST")
        res.send({
            created:false,
        })
    })
})

// GET USERNAMES AND LIST OF PROFILE IMAGES FOR THE LIST OF THE POSTS 
const HandleUsernames = async (req,res)=>{

    const list = req.body.body 

    

    let output = [] 
    const loopasync = async ()=>{
        for(let i = 0 ; i < list.length ; i++)
        {
            let result = await post.findById(list[i]) 

            let name = result.createdBy 

            let profile = await user.findOne({
                email:name, 
            })

            output.push({
                profile: profile.imageurl,
                username:profile.username,
                email:name,
                title: result.title, 
                body:result.content, 
                created:result.createdAt, 
                upvotes:result.upvotes, 
                downvotes:result.downvotes,
                comments:result.comments,
                id: list[i],
            }) 
        }
    }

    loopasync().then(()=>{
        
        res.send({
            output:output,
        })
    }).catch((err)=>{
        console.log("Error: ",err)
        res.send({
            output:output
        })
    })
}

router.route('/getdata').post((req,res,next)=>{
   
    HandleUsernames(req,res).then(()=>{
        console.log("Success")
    }).catch((err)=>{
        console.log("Error") 
    })
})


// HANDLES UPVOTE 
router.route('/upvote').post((req,res,next)=>{
    
    // Add the user to the upvotes 
    post.findById(req.body.id).then((val)=>{

        if(val.downvotes.includes(req.body.email))
        {
            val.downvotes.splice(val.downvotes.indexOf(req.body.email),1) 
        }
        val.upvotes.push(req.body.email) 

        val.save().then(()=>{
            console.log("Success")
            res.send({
                message:true, 
            })
        }).catch((err)=>{
            console.log("FAILURE")
            res.send({
                message:false,
            })
        })
    }).catch((err)=>{
        console.log("Error: ",err) 
    })
})

// HANDLES DOWNVOTE 
router.route('/downvote').post((req,res,next)=>{
    
    // Add the user to the upvotes 
    post.findById(req.body.id).then((val)=>{

        if(val.upvotes.includes(req.body.email))
        {
            val.upvotes.splice(val.upvotes.indexOf(req.body.email),1) 
        }
        val.downvotes.push(req.body.email) 

        val.save().then(()=>{
            console.log("Success")
            res.send({
                message:true, 
            })
        }).catch((err)=>{
            console.log("FAILURE")
            res.send({
                message:false,
            })
        })
    }).catch((err)=>{
        console.log("Error: ",err) 
    })
})


// HANDLES THE COMMENT ADDITION TO A POST 
router.route('/comment').post((req,res,next)=>{
    post.findById(req.body.id).then((val)=>{
        val.comments.push({
            body: req.body.body,
            by: req.body.email,
        })

        val.save().then(()=>{
            console.log("NICE")
        }).catch((err)=>{
            console.log("ERROR")
        })
    }).catch((err)=>{
        console.log("ERROR") 
    })
})

// GET PROFILE IMAGES, USERNAMES OF THE PEOPLE WHO HAVE COMMENTED ON A POST
const HandleCommentPost = async (req,res)=>{

    // Get list of comments
    const list = req.body.list 

    // Now get the user data 
    let output = [] 

    const loopasync2 = async ()=>{
        for(let i = 0 ; i < list.length ; i++)
        {
            let element = list[i] 

            let details = await user.findOne({
                email: element.by 
            }) 

            output.push({
                profile: details.imageurl, 
                username: details.username, 
            })
        }
    }


    loopasync2().then(()=>{
        // console.log("output: ",output) 
        res.send({
            output:output,
        })
        
    }).catch((err)=>{
        console.log("Error: ",err)
       
    })
}

router.route('/getcomment').post((req,res,next)=>{
    HandleCommentPost(req,res).then((out)=>{
        console.log("Successful")
    }).catch((err)=>{
        console.log("ERROR LMAOOO")
    })
})

// Handles Bookmarked Posts
router.route('/bookmark').post((req,res,next)=>{
    const id = req.body.id 

    const result = authenticateToken(req) 

    user.findById(result.id).then((val)=>{
        val.savedPosts.push(id) 
        val.save().then(()=>{
            res.send({
                message:true,
            })
        }).catch((err)=>{
            console.log("Saving Error")
            res.send({
                message:false,
            })
        })
    }).catch((err)=>{
        console.log("ERROR : PATA NAHI KYA")
        res.send({
            message:false,
        })
    })
})

// Handles Remove Bookmark
router.route('/delbookmark').post((req,res,next)=>{
    const id = req.body.id 

    const result = authenticateToken(req) 

    user.findById(result.id).then((val)=>{
        val.savedPosts.splice(val.savedPosts.indexOf(id),1)  
        val.save().then(()=>{
            res.send({
                message:true,
            })
        }).catch((err)=>{
            console.log("Saving Error")
            res.send({
                message:false,
            })
        })
    }).catch((err)=>{
        console.log("ERROR : PATA NAHI KYA")
        res.send({
            message:false,
        })
    })
})


module.exports = router 
