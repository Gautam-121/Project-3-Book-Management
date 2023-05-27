const User = require("../models/userModel")
const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorHandler");

let isAuthenticate = function (req, res, next) {

    try {

        const {token} = req.cookies

        if(!token){
            return next(new ErrorHandler("Token is Absent , Please logged In" , 401))
        }

        jwt.verify(token , process.env.JWT_SECRET , async (error , decodedToken) => {

            if(error){
                const message = error.message ==  "jwt expired" ? "token is expired ,please login again" : "token is invalid,please recheck your token"
                return next(new ErrorHandler(message , 401))
            }

            req.user = await User.findById(decodedToken.id)
            next()
        })
    }
    catch (error) {
        return next(new ErrorHandler(err , 500))
    }
}

const authorized = (...roles)=>{

    return (req , res , next) => {


        if(!roles.includes(req?.user?.role)){
            return next(new ErrorHandler("You have not Permission To Access It" , 403))
        }
        next()
    }
}

// let authorise = async function (req, res, next) {

//     try {



//         let userIdFromToken = req.decodedToken["authorId"]
//         let userIdFromClient = req.params.bookId
//         console.log(userIdFromClient)
//         console.log(userIdFromToken)

//         if (userIdFromClient) {

//             if (!mongoose.Types.ObjectId.isValid(userIdFromClient)) return res.status(400).send({ msg: "bookId is InValid", status: false })
//             let findBookDoc = await bookModel.findById({ _id: userIdFromClient })
//             if (!findBookDoc) return res.status(404).send({ msg: "No user resister", status: false })
//             if (userIdFromToken !== findBookDoc.userId.toString()) {
//                 return res.status(403).send({ msg: "user is not Authorised for this operation", status: false })
//             }
//             next()
//         } else if (req.method === "POST" && req.path === "/books") {

//             let userIdFromClient = req.body.userId;
//             if(!isValid(userIdFromClient)) return res.status(400).send({status : false , msg : "userId is required"})
//             if (!mongoose.Types.ObjectId.isValid(userIdFromClient)) return res.status(400).send({ msg: "user is InValid", status: false })
//             if (userIdFromToken !== userIdFromClient.toString()) {
//                 return res.status(403).send({ msg: "user is not Authorised for this operation", status: false })

//             }
//             next()
//         }
//         else {
//             return res.status(400).send({ status: false, msg: "Please provide BlogID" })
//         }

//     } catch (err) {
//         return res.status(500).send({ msg: err.message, status: false })
//     }
// }


module.exports = { isAuthenticate, authorized }