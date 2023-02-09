const express = require('express')
const mongoose = require('mongoose')
const pageSchema = require('../MongoStuff/Objects/subgreddiit')
const jwt = require('jsonwebtoken') 
const userSchema = require('../MongoStuff/Objects/user')

require('dotenv').config() 


const router = express.Router()


router.use(express.json())

const gr = mongoose.model("Greddiits",pageSchema) 

const user = mongoose.model("User",userSchema) 


// aUTHENTICATE TOKEN
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

const verify = async (name)=>{
    const result = await gr.findOne({name:name}) 

    if(result)
    {
        return false 
    }
    
    return true 
}

const create = async (req , email)=>{
    const newmodel = new gr({
        name:req.body.name,
        tags:req.body.tags,
        bannedKeywords:req.body.ban,
        description:req.body.desc,
        moderators:[email],
    })

    const result = await newmodel.save()

    return result._id
}
// CREATE A SUB-GREDIIT 
router.route('/create').post((req,res,next)=>{
    // Creates a subgreddit

    const result = authenticateToken(req)
    
    // console.log("Entered here") 
    
    verify(req.body.name).then((val)=>{
        if(val === false)
        {
            res.send({
                created:'NO'
            })
        }
        else 
        {
            create(req , result.email).then((val)=>{
                // console.log("val: ",val)
                // Now add this id to the page of the user
                user.findById(result.id).then((my)=>{
                    
                    my.created.push(val) 
                    // console.log("my.created:",my.created) 
                    my.save().then(()=>{
                    res.send({
                        created:'YES',
                    })
                })
                })
                
            }).catch((err)=>{
                console.log("ERROR IN CREATING SUBGREDDIT")
                console.log(err)
                res.send({
                    created:'ERROR'
                })
            })
        }
    })
})

// RETRIEVE THE NAME, FOLLOWERS, IMAGE OF THE usernames 
const HandleUsernames = async (req,res)=>{
    
    const list = req.body.list 

    let output = []

    console.log("Start")
    console.log("list: ",list)
    const loopasync = async ()=>{

        for(let i = 0 ; i < list.length ; i++)
        {
            let ele = list[i] 

            let data = await gr.findById(ele) 

            if(data)
            {
                output.push({
                    name:data.name, 
                    followers:data.followers.length,
                    moderators:data.moderators.length,
                    posts:data.posts.length, 
                    createdate:data.createdOn, 
                    image:data.profileImageURL
                })
            
        }
        }
    }

    loopasync().then(()=>{
        res.send({
            list:output,
        })
    }).catch((err)=>{
        console.log("ERROR HERE IN RETIREVE") 
    })
}

router.route('/get').post((req,res,next)=>{

    // Find 
    HandleUsernames(req,res).then(()=>{
        console.log("Success")
    }).catch((err)=>{
        console.log("Error") 
    })

})

// GET ALL DETAILS OF THE USERNAME 
const HandleIt = async (req,res)=>{
    // Find 
    console.log("req: ",req.body.name) 
    gr.findOne({
        name: req.body.name, 
    }).then((val)=>{
        
        console.log("Val: ",val) 
        if(val == null)
        {
            res.send({
                message:'INVALID',
            })
        }
        else 
        {
            res.send({
                message:'VALID',
                data:val,
            })
        }
    }).catch((err)=>{
        console.log("Error in the retrieval")
        console.log(err) 
    })
}

router.route('/page').post((req,res,next)=>{

    HandleIt(req,res).then(()=>{
        console.log("Success")
    }).catch((err)=>{
        console.log("ERROR:",err) 
    })

})

// EDIT THE GREDDIIT PAGE
router.route('/edit').post((req,res,next)=>{

    const name = req.body.name

    gr.findOne({
        name:name, 
    }).then((val)=>{
        if(val == null)
        {
            res.send({
                edit:'NO'
            })
        }
        else
        {
            val.description = req.body.desc 
            val.profileImageURL = req.body.profile 
            val.coverImageURL = req.body.cover 

            val.save().then(()=>{
                res.send({
                    edit:'YES'
                })
            }).catch((err)=>{
                console.log('err',err)
                res.send({
                    edit:'Error'
                })
            })
        }
    }).catch((err)=>{
        console.log(err)
        res.send({
            edit:'Error'
        })
    })
    
})


// FOLLOW REQUEST FOR THE SUBGREDDIIT 
const HandleFollow = async (req,res)=>{
 
    let email = req.body.email 

    let reason = req.body.reason 

    let name = req.body.name // Name of the subgreddiit 

    gr.findOne({
        name:name, 
    }).then((val)=>{
        if(val === null)
        {
            res.send({
                added:'NO',
            })
        }
        else 
        {
            console.log("email: ",email)
            if(val.followers.includes(email))
            {
                res.send({
                    added:'ALREADY'
                })
            }


            // val.followers.push(email)
            val.pending.push({
                email:email,  
                reason:reason,
            }) 

            val.save().then(()=>{
                res.send({
                    added:'YES',
                })
            }).catch(()=>{
                res.send({
                    added:'ERROR'
                })
            })
        }

    }).catch((err)=>{
        console.log("Error",err) 
    })

}

router.route('/follow').post((req,res,next)=>{

    HandleFollow(req,res).then(()=>{
        console.log('done')
    }).catch((err)=>{
        console.log('error',err) 
    })
})

// FOLLOWS THE USER ACCEPT REQUEST GUYS 

const Accept = (req,res)=>{

    let email = req.body.email 
    let username = req.body.username 
    let reason = req.body.reason 

    let name = req.body.name 

    gr.findOne({
        name:name,
    }).then((val)=>{
        val.followers.push(email) 
        val.pending.splice(val.pending.indexOf({
            username:username, 
            reason:reason, 
            email:email
        }),1) 

        val.save().then(()=>{

        }).catch((err)=>{
            console.log("error: ",err) 
        })

    }).catch((err)=>{
        console.log("Error: ",err) 
    })
}

router.route('/accept').post((req,res,next)=>{
    Accept(req,res).then(()=>{
        console.log("Done")
    }).catch((err)=>{
        console.log("error:",err) 
    })
})


// REJECT THE REQUEST
const Reject = (req,res)=>{

    let email = req.body.email 
    let username = req.body.username 
    let reason = req.body.reason 

    let name = req.body.name 

    gr.findOne({
        name:name,
    }).then((val)=>{
        
        val.pending.splice(val.pending.indexOf({
            username:username, 
            reason:reason, 
            email:email
        }),1) 

        val.save().then(()=>{

        }).catch((err)=>{
            console.log("error: ",err) 
        })

    }).catch((err)=>{
        console.log("Error: ",err) 
    })
}

router.route('/reject').post((req,res,next)=>{
    Reject(req,res).then(()=>{
        console.log("Done")
    }).catch((err)=>{
        console.log("error:",err) 
    })
})

// FOLLOW REQUEST FOR THE SUBGREDDIIT 
const UnHandleFollow = async (req,res)=>{

    let email = req.body.email 

    let name = req.body.name // Name of the subgreddiit 

    gr.findOne({
        name:name, 
    }).then((val)=>{
        if(val === null)
        {
            res.send({
                added:'NO',
            })
        }
        else 
        {
            console.log("email: ",email)
            

            val.followers.splice(val.followers.indexOf(email),1)  

            val.save().then(()=>{
                res.send({
                    added:'YES',
                })
            }).catch(()=>{
                res.send({
                    added:'ERROR'
                })
            })
        }

    }).catch((err)=>{
        console.log("Error",err) 
    })

}

router.route('/unfollow').post((req,res,next)=>{

    UnHandleFollow(req,res).then(()=>{
        console.log('done')
    }).catch((err)=>{
        console.log('error',err) 
    })
})


// HANDLES THE PART WHEN WE HAVE TO FIND THE 
// 1. USERNAME, PROFILE IMAGE 
const HandleList = async (req,res)=>{


    const list1 = req.body.list

    let output = []


   

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
                output.push({
                    username:data.username,
                    profile:data.imageurl,
                })
            }
        }
        


}
    
    loopsasync().then(()=>{
        
        res.send({
            usernames:output,
         
        })
    })
    
}
router.route('/getdata').post((req,res,next)=>{
    HandleList(req,res).then(()=>{
        console.log("Done")
    }).catch((err)=>{
        console.log("Error: ",err) 
    })
})


// GET THE USERNAMES FROM PENDING 
const HandleListit = async (req,res)=>{


    const list1 = req.body.list

    let output = []

    console.log("Start") 
    const loopsasync = async () => {
         
        for(let i = 0 ; i < list1.length ; i++)
        {
            let ele = list1[i].email 
            let data = await user.findOne({
                email:ele
            })

            if(data != null)
            {
                output.push({
                    username:data.username,
                    profile:data.imageurl,
                    reason:list1[i].reason,
                    email:ele,
                })
            }
        }
        


}
    
    loopsasync().then(()=>{

        
        res.send({
            usernames:output,
         
        })
    })
    
}
router.route('/getdata2').post((req,res,next)=>{
    HandleListit(req,res).then(()=>{
        console.log("Done")
    }).catch((err)=>{
        console.log("Error: ",err) 
    })
})





// SUBGREDDIIT DELETE THAT 
const HandleDelete = async (req,res)=>{

    const username = req.body.name 

    let node = await gr.findOne({
        name:username, 
    })

     let combine = node.followers + node.moderators + node.bannedKeywords

     const loopasync = async ()=>{

        for(let i = 0 ; i < combine.length ; i++)
        {
             let e = combine[i]
            user.findOne({
                email:e
            }).then((val)=>{
                val.created.splice(val.created.indexOf(username),1) 
                val.save().then(()=>{
                    console.log("success")
                }).catch((err)=>{
                    console.log("Error")
                })
            }).catch((err)=>{
                console.log("err:",err) 
            })
        
    }
    }

    loopasync().then(()=>{
        gr.deleteOne({
            name:username
        }).then(()=>{
            console.log("DONE DELETION")
            res.send({
                message:'DELETED',
            })
        }).catch((err)=>{
            console.log("ERROR IN DLEETING OF ")
            console.log(err)
            res.send({
                message:'NOT',
            })
        })
    })
}

router.route('/delete').post((req,res,next)=>{
    HandleDelete(req,res).then(()=>{
        console.log("uwu")
    }).catch((err)=>{
        console.log(err) 
    })
})


// SEARCH SUBGREDDIIT BASED ON THE REGEX EXPRESSION 
router.route('/search').post((req,res,next)=>{
    const search = req.body.search 

    gr.find({
        name:{
            $regex: search, 
            $options: 'i',
        }
    }).then((val)=>{

        res.send({
            list:val,
        })

    }).catch((err)=>{
        console.log("ERROR") 
        res.send({
            list:[],
        })
    })
})

module.exports = router 