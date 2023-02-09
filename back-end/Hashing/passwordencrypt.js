const bcrypt = require('bcrypt')

const generateHashedPassword = async (password)=>{
    var salt = bcrypt.genSalt(10)
    
    var hashedpassword = bcrypt.hash(password.toString(),(await salt).toString())

    return (await hashedpassword).toString() 

}


module.exports = {
    generateHashedPassword
}