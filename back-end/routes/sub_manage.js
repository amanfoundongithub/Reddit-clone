const express = require('express')
const mongoose = require('mongoose')
const pageSchema = require('../MongoStuff/Objects/subgreddiit')
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

    const newstat = new stat({
        name: req.body.name, 
        dateOfCreation: new Date(),
        followers: [email],
    })

    await newstat.save() 

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
                    image:data.profileImageURL,
                    bannedKeywords:data.bannedKeywords, 
                    banned:data.banned,
                    desc:data.description
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

                if(!ans.followers.includes(email))
                {
                    ans.followers.push(email) 
                }
    
                console.log("done adding") 
            }
    
        }).catch((err) => {
            console.log("ERROR BRO: ", err)
        })

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

            val.banned.push(email) 
            val.save().then(()=>{
                stat.find({
                    name: name,
                }).then((valit) => {
                    const date = new Date() 
                    const req = valit.filter((e) => {
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
        
                        if(ans.followers.includes(email))
                        {
                            ans.followers.splice(ans.followers.indexOf(email),1) 
                        }
            
                        console.log("done adding") 
                    }
            
                }).catch((err) => {
                    console.log("ERROR BRO: ", err)
                })
        
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
    for(let i = 0 ; i < node.posts.length ; i++)
    {
        let id = node.posts[i]

        user.find({
            savedPosts:id, 
        }).then((val)=>{
            val.forEach((e)=>{
                e.savedPosts.splice(e.savedPosts.indexOf(id),1) 
                e.save()
            })
        }).catch((err)=>{
            console.log("Error") 
        })
        let res = await post.findByIdAndRemove(id) 

        // console.log("Res: ",res) 
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

    const listtag = req.body.list
    gr.find({
        name:{
            $regex: search, 
            $options: 'i',
        },
    }).then((val)=>{
        let updated = []

        if(listtag.length === 0)
        {
            res.send({
                list:val,
            })
        }
        else 
        {
            for(let i = 0 ; i <val.length ; i++)
        {
            console.log("truth value :" ,listtag.every(e=> val[i].tags.includes(e)))
            if(listtag.every(e=> val[i].tags.includes(e)))
            {
                updated.push(val[i])  
            }
        }
        console.log("val: ",updated) 
        res.send({
            list:updated,
        })
        }
        

    }).catch((err)=>{
        console.log("ERROR") 
        res.send({
            list:[],
        })
    })
})

// GET THE USERNAMES AND PROFILE IMAGES OF THE PEOPLE 
// Function to update the values
const HandleReport = async (req,res)=>{
    const list1 = req.body.list1 

    let output = []
    
    const loopsasync = async () => {
         
        for(let i = 0 ; i < list1.length ; i++)
        {
            let ele = list1[i].reportedBy 
            let ele2 = list1[i].reported
            let data = await user.findOne({
                email:ele
            })

            let data2 = await user.findOne({
                email:ele2
            })

            if(data != null)
            {
                output.push({
                    usernamereporter: data.username,
                    profilereporter: data.imageurl,
                    usernamereported: data2.username,
                    profilereported: data2.imageurl,
                })
            }
    }

    
}

    loopsasync().then(()=>{
        res.send({
            out:output,
        })
    })
    
}
// Get usernames of the followers 
router.route('/usernameofreports').post((req,res,next)=>{
    
    HandleReport(req,res).then(()=>{
        console.log("Done") 
    })
})

// CHECK IF STATS EXISTS FOR THE PAGE OR NOT
// IF NOT , WE WILL CREATE ONE 
router.route('/statcreate').post((req,res,next)=>{
    const date = new Date() 


    gr.find({

    }).then((val)=>{
        val.forEach((e)=>{
            let name = e.name 
            stat.find({
                name:name, 
                
            }).then((val)=>{
                const req = val.filter((e)=>{

                    let dateit = new Date(e.dateOfCreation)
                    return dateit.getFullYear() === date.getFullYear() && dateit.getMonth() === date.getMonth() && dateit.getDate() === date.getDate() 
                }) 
                if(req.length === 0)
                {
                    const lmao = new stat({
                        name: name, 
                        dateOfCreation: date, 
                    })
        
                    lmao.save()
                }
                
            }).catch((err)=>{
                console.log("ERROR BRO: ",err) 
            })
        })
    }).catch((err)=>{
        console.log("Error")
    })
})

// IF THE USER VISITS THE SPACE, THEN WE SHOULD ACTUALLY BE ABLE TO ADD HIM TO THE LIST 
router.route('/visit').post((req,res,next)=>{
    const email = req.body.emailid
    const name = req.body.name 

    console.log("email : ",email)
    console.log("name: ",name) 

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

            if(!ans.visits.includes(email))
            {
                ans.visits.push(email)
            }

            console.log("done adding") 
            ans.save().then(()=>{
                res.send({
                    done: true,
                })
            }) 
        }

    }).catch((err) => {
        console.log("ERROR BRO: ", err)
    })
})

// Get stats
const getDate = (date)=>{
    
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var now = new Date(date);
    return months[now.getMonth()] + ' ' + now.getDate() + ',' + now.getFullYear() 
}

router.route('/getstat').post((req,res,next)=>{
    // Get all stats
    const name = req.body.name 

    stat.find({
        name: name,
    }).then((val)=>{
        let xaxis = []
        let yaxis = []
        let zaxis = []
        let taxis = []
        for(let i  = 0 ; i < val.length ; i++)
        {
            xaxis.push(getDate(val[i].dateOfCreation))
            yaxis.push(val[i].visits.length) 
            zaxis.push(val[i].posts) 
            taxis.push(val[i].followers.length) 
        }

        for(let i = 1 ; i < val.length ; i++)
        {
            taxis[i] = taxis[i] + taxis[i - 1] 
        }

        res.send({
            xaxis: xaxis, 
            yaxis: yaxis,
            zaxis: zaxis,
            taxis: taxis,
        })
    }).catch((err)=>{
        console.log("ERROR")
    })
})
module.exports = router 