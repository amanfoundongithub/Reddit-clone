const express = require('express')
const mongoose = require('mongoose')
const userSchema = require('../MongoStuff/Objects/user')
const { dbConnect } = require('../MongoStuff/Connection/connection')
const { generateHashedPassword } = require('../Hashing/passwordencrypt')
const bcrypt = require('bcrypt') 
const jwt = require('jsonwebtoken') 


router = express.Router() 

require('dotenv').config() 

dbConnect() 
router.use(express.json());

const user = mongoose.model("User",userSchema) 

/* PRELIMINARY CHECK */ 
const verify = async (email)=>{

    // Finds one user 
    const result = await user.findOne({email:email})

    if(result === null)
    {
        return true 
    }

    return false 
}

router.route('/verify').post((req,res,next)=>{

    verify(req.body.email).then((val)=>{
        console.log("Response generated") 
        console.log("the result is : ",val) 
        res.send({
            result: val,
        })
    }).catch((err)=>{
        console.log("Error while sending response")
        res.send({
            result:null
        })
    })
})


/* CREATES THE FINAL ACCOUNT OF THE USER */
const run = async (req)=>{
    const newusermodel =  new user({
        name:{
            firstname:req.body.name.firstname,
            lastname:req.body.name.lastname,
        },
        gender:req.body.gender, 
        username:req.body.username,
        dob:req.body.dob,
        membersince:req.body.membersince,
        email:req.body.email,
        password: (await generateHashedPassword(req.body.password)).toString(), 
        phone:req.body.phone,
    })
    
    
        newusermodel.save().then(()=>{
            console.log("Done")
        }).catch((err)=>{
            console.log("Error in database trasaction")
        })
}

const finalverify = async (email)=>{

    // Finds one user 
    const result = await user.findOne({username:email})

    if(result === null)
    {
        return true 
    }

    return false 
}


router.route('/create').post((req,res,next)=>{

    finalverify(req.body.username).then((val)=>{
        if(val === false){
            console.log("The message comes out to be : ",val) 
            res.send({
                message:false,
            })
        }
        else 
        {
            run(req).then(()=>{
                res.send({
                    message:true,
                })
            }).catch(()=>{
                res.send({
                    message:null,
                })
            })
        }
    }).catch((err)=>{
        console.log("Error")
    })
    
})

/* SIGN IN IS HANDLED HERE */ 

// Returns id in mongo if it exists and null if it does not  
const verifyuser = async (username,password)=>{

    // Verifies the user in database

    const user2 = await user.findOne({username:username}) 

    // console.log(user2) 
    if(user2 == null)
    {
        return null 
    }

    let retval = null 
    // If not, we compare the hashed passwords
    let result = await bcrypt.compare(password,user2.password) 
    
    if(result === true)
    {
        return user2._id 
    }

    return retval 

}

const getId = async (username)=>{

    const doc = await user.findOne({username:username}) 

    return {
        id: doc._id,
        email:doc.email,
    }

}


router.route('/signin').post((req,res,next)=>{
    verifyuser(req.body.username,req.body.password).then((found)=>{
         // gENERATE AN ACCESS TOKEN 

        let object2 = {
            id:undefined 
        }

        getId(req.body.username).then((lol)=>{
            object2 = {
                id:lol.id,
                email:lol.email,
                username: req.body.username,
            
            }

            const accesstoken = jwt.sign(object2,process.env.SECRET_TOKEN) 

            res.send({
                message:found,
                accesstoken:accesstoken,
            }) 
        }).catch((err)=>{
            console.log("pary") 
        })

        
    }).catch((err)=>{
        res.send({
            message:undefined,
        })
    })
})



module.exports = router