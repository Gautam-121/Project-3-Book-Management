const jwt = require("jsonwebtoken")

const sendToken = (user , res , statusCode)=>{

    const token =  jwt.sign({id : user._id} , process.env.JWT_SECRET , {
        expiresIn : process.env.JWT_EXPIRES
    })

    const option = {
        expires : new Date(
            Date.now() + 5 * 24 * 60 * 60 * 1000 
        ),
        httpOnly : true
    }

    res.status(statusCode).cookie("token" , token , option).json({
        success : true,
        user,
        token
    })
}

module.exports = sendToken