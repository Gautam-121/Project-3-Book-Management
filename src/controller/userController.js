const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/sendToken");

const createUser = async function (req, res , next) {

    try {

        const {title , name , phone , email , password , address , role } = req.body

        if(!["Mr", "Mrs", "Miss"].includes(title)){
            return next(new ErrorHandler("Title shoulb be only Mr , Miss or Mrs" , 400))
        }

        if(!["author" , "user"].includes(role)){
            return next(new ErrorHandler("Role must be author or user" , 400))
        }

        const user = await User.create({
            title , 
            name , 
            phone , 
            email , 
            password , 
            address , 
            role
        })

        res.status(200).json({
            success : true,
            user
        })

    } catch (err) {
        return next(new ErrorHandler(err , 500))
    }
}


const loginuser = async (req, res , next) => {

    try {

        const {email , password} = req.body

        if(!email || !password){
            return next(new ErrorHandler("Please Enter Email and Password" , 400))
        }

        const user =  await User.findOne({email}).select("+password")

        if(!user){
            return next(new ErrorHandler("No user found , Please Log In" , 401))
        }

        const compare = await user.comparePassword(password)

        if(!compare){
            return next(new ErrorHandler("Password is not match" , 400))
        }

        sendToken(user , res , 200)
  
    } catch (err) {
        return next(new ErrorHandler(err , 500))
    }
}


module.exports = { createUser, loginuser }
