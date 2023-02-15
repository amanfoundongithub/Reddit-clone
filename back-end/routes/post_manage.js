const express = require('express')
const mongoose = require('mongoose')
const pageSchema = require('../MongoStuff/Objects/subgreddiit')
const { dbConnect } = require('../MongoStuff/Connection/connection')
const jwt = require('jsonwebtoken') 
const userSchema = require('../MongoStuff/Objects/user')

const postSchema = require('../MongoStuff/Objects/post')
const statSchema = require('../MongoStuff/Objects/stats')

require('dotenv').config() 


const router = express.Router()

router.use(express.json())

const gr = mongoose.model("Greddiits",pageSchema) 

const user = mongoose.model("User",userSchema) 

const post = mongoose.model("Posts",postSchema)

const stat = mongoose.model("Stats",statSchema) 


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
                // Now add to stats 
                stat.find({
                    name: name,
                }).then((val) => {
                    const date = new Date() 
                    const req = val.filter((e) => {
                        let dateit = new Date(e.dateOfCreation)
                        return dateit.getFullYear() === date.getFullYear() && dateit.getMonth() === date.getMonth() && dateit.getDate() === date.getDate()
                    })
                    if (req.length === 0) {
                         
                        const lmao = new stat({
                            name: name,
                            dateOfCreation: date,
                        })
            
                        lmao.save()
                    }
                    else 
                    {
                        console.log("ans: ",req[0]) 
                        let ans = req[0] 
            
                        ans.posts = ans.posts + 1
                        console.log("done adding") 
                        ans.save() 
                    }
            
                }).catch((err) => {
                    console.log("ERROR BRO: ", err)
                })
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
        console.log(err) 
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

            if(result === null)
            {
                continue 
            }

            let name = result.createdBy 

            let profile = await user.findOne({
                email:name, 
            })

            let greddit = await gr.findOne({
                posts:list[i],
            })

            if(greddit.banned.includes(name) === true)
            {
                output.push({
                    profile: 'https://qph.cf2.quoracdn.net/main-qimg-73e139be8bfc1267eeed8ed6a2802109-lq',
                    username:'BLOCKED USER',
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

           else 
           {
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

// GET THE BOOKMARKED POSTS
const Handle = async (req,res)=>{

    // Get list of comments
    const list = req.body.list 

    // check 
    const lol = req.body.lol

    // Now get the user data 
    let output = [] 

    const loopasync2 = async ()=>{
        for(let i = 0 ; i < list.length ; i++)
        {
            if(list[i].length === 0)
            {
                continue 
            }
            let element = list[i] 
            

            let details = await post.findById(element) 

            if(details === null)
            {
                continue 
            }

            let name = details.createdBy

            let gre = await gr.findOne({
                posts:details._id
            })

            let profile = await user.findOne({
                email:name, 
            })

            if(lol === true)
            {
                
                output.push({
                    profile: profile.imageurl,
                username:profile.username,
                email:name,
                    id: details._id,
                    title:details.title, 
                    body:details.content,
                    created:details.createdAt,
                    createdBy:details.createdBy,
                    upvotes:details.upvotes,
                    downvotes:details.downvotes,
                    comments:details.comments,
                    name:gre.name,
                })
            }
            else
            {
                output.push(details)  
            }
            
            
        }
    }


    loopasync2().then(()=>{
        
        res.send({
            list:output,
        })
        
    }).catch((err)=>{
        console.log("Error: ",err)
       
    })
}

router.route('/bookmarkit').post((req,res,next)=>{
    Handle(req,res).then(()=>{
        console.log("Successful request")
    }).catch((err)=>{
        console.log("ERROR")
    })
})

// MAKE A REQUEST TO REPORT A PAGE
router.route('/report').post((req,res,next)=>{
    // Now take the details
    const postID = req.body.postID
    const reporter = req.body.reporter
    const reported = req.body.reported 
    const concern  = req.body.concern 
    const name     = req.body.name 

    gr.findOne({
        name:name,
    }).then((val)=>{

        val.reports.push({
            reportedBy:reporter, 
            reported:reported, 
            postID:postID, 
            Concern:concern,
        })

        val.save().then(()=>{
            res.send({
                reported: true, 
            })
            console.log("REPORTED")
        }).catch((err)=>{
            console.log("LMAOSAVJFGU")
        })
    })

})

// GET DETAILS OF A SINGLE POST FOR REPORT PAGE
router.route('/reportdata').post((req,res,next)=>{
    const request = req.body.id 

    post.findById(request).then((val)=>{
        res.send({
            data:val,
        })
    }).catch((err)=>{
        res.send({
            data:undefined,
        })
    })
})



// NOW DELETE A POST FOR THE REPORT PAGE
const HandleDeletePost = async (id,res,report)=>{
    // First remove post from the bookmarked

    console.log("id: ",id) 
    let val = await user.find({
        savedPosts:id, 
    })

    for(let i = 0 ; i < val.length ; i++)
    {
        let e = val[i] 

        if(e.savedPosts === undefined)
        {
            return 
        }
        e.savedPosts.splice(e.savedPosts.indexOf(id),1)
        await e.save()
    }
    

    // Now remove the post from the database
    let val2 = await gr.findOne({
        posts:id,
    })

    console.log("val: ",val2)
    if(val2)
    {
        val2.posts.splice(val2.posts.indexOf(id),1) 
        let element = val2.reports.indexOf(val2.reports.find(item =>{
            // console.log("item._id",item._id.toString())  
            return item._id.toString() === report
        })) 

        val2.reports.splice(element,1) 

        await val2.save() 
    }

    // Finally delete the post
     await post.findByIdAndDelete(id)
    res.send({
        success:true, 
    })
    
}
router.route('/deletepost').post((req,res,next)=>{
    // Deletes a post given its id
    const id = req.body.id 
    const report = req.body.report 
    HandleDeletePost(id,res,report).then(()=>{
        console.log("DELETED")
    }).catch((err)=>{
        console.log("ERROR IN DELETION")
        console.log(err) 
        res.send({
            success:false,
        })
    })
    
})


// IGNORE THE POST
router.route('/ignore').post((req,res,next)=>{

    const postId = req.body.post

    const id = req.body.post2

    console.log("id: ",id) 

    gr.findOne({
        posts:postId
    }).then((val)=>{
        // Now disable in subrequest
        let element = val.reports.indexOf(val.reports.find(item =>{
            console.log("item._id",item._id.toString())  
            return item._id.toString() === id
        }))

        val.reports[element].blockButton = true 

        val.save().then(()=>{
            console.log("Done")
            res.send({
                done:true,
            })
        })

    })
})
module.exports = router 
