const express = require('express')
const mongoose = require('mongoose')
const userSchema = require('../MongoStuff/Objects/user')
const { dbConnect } = require('../MongoStuff/Connection/connection')
const jwt = require('jsonwebtoken') 
const chatSchema = require('../MongoStuff/Objects/chat') 
require('dotenv').config() 


const router = express.Router()

dbConnect() 
router.use(express.json());

const user = mongoose.model("User",userSchema) 

const chat = mongoose.model("Chat",chatSchema) 


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

router.route('/profile').post((req,res,next)=>{

    const result = authenticateToken(req) 

    if(result.message === 'NO TOKEN')
    {
        res.send({
            message:undefined 
        })
        return 
    }
    else if(result.message === 'NOT OK')
    {
        res.send({
            message:undefined
        })
        return 
    }

    // console.log("Result : ",result) 
    console.log("TOKEN VERIFIED") 
    
    user.findById(result.id).then((val)=>{
        // console.log("Obtained : ",val) 
        if(val === null)
        {
            res.send({
                message:null
            })
            return 
        }
        res.send({
            message:val,
        })
    }).catch((err)=>{
        console.log("error")
        console.log(err) 
    })
})

// EDIT PROFILE 

// Updates the values 
const run = async (req,id)=>{
    const newusermodel = {
        name:{
            firstname:req.body.name.firstname,
            lastname:req.body.name.lastname,
        },

        username:req.body.username,

        phone:req.body.phone,

        about:req.body.about,

        imageurl:req.body.imageurl,
    }
    
    req.created = false 
    user.findOneAndUpdate({
        _id:id,
    },newusermodel).then((val)=>{
        req.created = true 
        console.log("Done") 
    }).catch((err)=>{
        req.created = false 
        console.log("Update error") 
    })

 
}

// Check if username is there or not 
const finalverify = async (email)=>{

    // Finds one user 
    const result = await user.findOne({username:email})

    if(result === null)
    {
        return true 
    }

    return false 
}


router.route('/editprofile').post((req,res,next)=>{
    
    const result = authenticateToken(req) 

    if(result.message === 'NO TOKEN' || result.message === 'NOT OK')
    {
        res.send({
            message:undefined 
        })
        return 
    }

    run(req,result.id).then(()=>{
         
        res.send({
            created:req.created
        })
        }).catch((err)=>{
                res.send({
                    created:false 
                })
            })
    

})

// FIND THE USER TO VIEW THE OTHER PROFILES

// Returns the id of the username or else the null value

router.route('/find').post((req,res,next)=>{

    const username = req.body.username 

    const result = authenticateToken(req) 

    console.log("request made") 

    user.findOne({
        username:username,
    }).then((val)=>{
        if(result.message === 'OK')
        {
            // Means we have already an account so check if the username matches or not
            if(result.username !== username)
            {
                res.send({
                    message:'LOGGED IN',
                    obtained:val,
                    transaction:true, 
                })
            }
            else 
            {
                // We need to tell to go back to profile page 
                res.send({
                    message:'PROFILE',
                    obtained:val,
                    transaction:true,
                })
            }
        }
        else if(result.message === 'NOT OK')
        {
            console.log("NOT OK HUH") 
            res.send({
                message:'LOGGED IN',
                obtained:val,
                transaction:true 
            })
        }
        else 
        {
            console.log("error here") 
            res.send({
                message:'error' 
            })
        }
        
    }).catch((err)=>{
        console.log("Error") 
        res.send({
            transaction:false 
        })
    })
})


// Checks if the user is following or not 

router.route('/check').post((req,res,next)=>{ 

    const result = authenticateToken(req) 

    console.log("username:",result.username) 
    user.findOne({
        email:result.email // get array of following 
    }).then((val)=>{
        if(result.message === 'OK')
        {
            // Account exists so we need to check if our one is in follower list or not 

            // Yes, the person is followed then send reponse that we can unfollow 
            if(val.following.includes(req.body.email))
            {
                res.send({
                    message:'Unfollow',
                    username: result.username,
                    transaction:true,
                })
            }
            else 
            {
                res.send({
                    message:'Follow',
                    username: result.username,
                    transaction:true,
                })
            }
        }
        else 
        {
            res.send({
                transaction:undefined 
            })
        }
    }).catch((err)=>{
        console.log("Error in the transaction") 
        console.log(err) 
    })

})


// Person wants to follow another person huh looks like an interesting request ! 

router.route('/follow').post((req,res,next)=>{

    const result = authenticateToken(req)

    const emailtofollow = req.body.email 

    console.log("result.email: ",result.email) 
    console.log("emailtofollow: ",emailtofollow) 
    user.findOne({
        email:result.email,
    }).then((val)=>{
        
        val.following.push(emailtofollow) 
        val.save().then(()=>{
            // Now add the follower to the email 
            user.findOne({
                email:emailtofollow,
            }).then((val)=>{
                val.followers.push(result.email) 
                val.save().then(()=>{
                    res.send({
                        message:'Saved'
                    })
                })
            }).catch((val)=>{
                res.send({
                    message:'NotSaved' 
                })
            })
        }).catch(()=>{
            res.send({
                message:'NotSaved'
            })
        })
    }).catch((err)=>{
        console.log("Error in finding") 
        console.log(err)
    })
})

// Now we want to unfollow so ig follow the same routes huh ? 
router.route('/unfollow').post((req,res,next)=>{

    const result = authenticateToken(req) 

    console.log("request result: ",result)  
    const res2 = result.email
    console.log("Res2: ",res2)  

    const emailtofollow = req.body.email 

    console.log("email to be unfollowed: ",emailtofollow) 
    console.log("email which is unfollowing:",result.username) 
    user.findOne({
        email:result.email,
    }).then((val)=>{
        console.log("val.following:",val.following) 
        val.following.splice(val.following.indexOf(emailtofollow),1) 
        console.log("val.following: ",val.following) 
        val.save().then(()=>{
            // Now add the follower to the email 
            user.findOne({
                email:emailtofollow,
            }).then((val)=>{
                val.followers.splice(val.followers.indexOf(res2),1)
                val.save().then(()=>{
                    res.send({
                        message:'Saved'
                    })
                })
            }).catch((val)=>{
                res.send({
                    message:'NotSaved' 
                })
            })
        }).catch(()=>{
            res.send({
                message:'NotSaved'
            })
        })
    }).catch((err)=>{
        console.log("Error in finding") 
        console.log(err)
    })
})

// Function to update the values
const HandleUsernames = async (req,res)=>{
    const list1 = req.body.list1 
    const list2 = req.body.list2

    console.log("req: ",list1)
    console.log("req: ",list2) 

    let output = []
    let output2 = []

    console.log("Start") 
    const loopsasync = async () => {
         
        for(let i = 0 ; i < list1.length ; i++)
        {
            let ele = list1[i] 
            let data = await user.findOne({
                email:ele
            })

            if(data != null)
            {
                output.push(data.username)
            }
    }

    for(let i = 0 ; i < list2.length ; i++)
        {
            let ele = list2[i] 
            let data = await user.findOne({
                email:ele
            })

            if(data != null)
            {
                output2.push(data.username)
            }

    }
}
    // await loopsasync() 
    // console.log("output1: ",output)
    // console.log("output2: ",list2) 
    loopsasync().then(()=>{
        
        console.log("output1",output)
        console.log("output2",output2) 
        res.send({
            usernames1:output,
            usernames2:output2,
        })
    })
    
}
// Get usernames of the followers 
router.route('/usernames').post((req,res,next)=>{
    
    HandleUsernames(req,res).then(()=>{
        console.log("Done") 
    })
})


// REMOVE FROM FOLLOWER AS FOLLOWS


router.route('/removefollower').post((req,res,next)=>{
    const follower = req.body.follower

    const email = req.body.email 

    user.findOne({
        email:follower,
    }).then((val)=>{
        val.following.splice(val.following.indexOf(email),1) 
        console.log("val.following: ",val.following) 
        val.save().then(()=>{
            // Now add the follower to the email 
            user.findOne({
                email:email,
            }).then((val)=>{
                val.followers.splice(val.followers.indexOf(follower),1)
                val.save().then(()=>{
                    res.send({
                        message:'Saved'
                    })
                })
            }).catch((val)=>{
                res.send({
                    message:'NotSaved' 
                })
            })
        }).catch(()=>{
            res.send({
                message:'NotSaved'
            })
        })
    }).catch((err)=>{
        console.log("Error in finding") 
        console.log(err)
    })
    
})


// BRING IN THE CHAT FEATURE !!!
router.route('/chatroom').post((req,res,next)=>{
    const to = req.body.to 
    const from = req.body.from 
    
    chat.find({
        participants:to,
    }).then((arr)=>{

        const val = arr.filter((e)=>{
            return e.participants.includes(from) 
        }) 

        if(val.length > 0) 
        {
            
            res.send({
                id: val[0]._id,
            })
        }
        else 
        {
            chat.create({
              participants: [to,from]  
            }).then((value)=>{
                res.send({
                    id:value._id 
                })
            })
        }
    }).catch((err)=>{
        console.log("FATAL ERROR CREATING/FINDING ROOM") 
    })

})

// Get the data from mongo
router.route('/preparechat').post((req,res,next)=>{
    const room = req.body.room 

    chat.findById(room).then((val)=>{
        if(val == null)
        {
            res.send({
                chats: [],
            })
        }
        else 
        {
            res.send({
                chats: val.messages,
            })
        }
    }).catch((err)=>{
        res.send({
            chats: undefined,
        })
    })
})
module.exports = router 