const mongoose = require('mongoose')
const userSchema = require('../Objects/user')

const url = 'mongodb+srv://AmanRaj:Aman2004Raj@cluster0.gncnuoe.mongodb.net/Authorization?retryWrites=true&w=majority'

const dbConnect = async ()=>{
    mongoose.connect(url,{
        
    }).then(()=>{
        console.log("Connection successful... MongoDB Op")
    }).catch((err)=>{
        console.log("Error occured, cannot connect to MongoDB...")
        console.log(err)
    })
}



module.exports = {dbConnect ,
                  
                 }