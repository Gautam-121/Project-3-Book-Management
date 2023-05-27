const ErrorHandler = require("../utils/errorHandler")

const errorMiddleware = (err,req,res,next)=>{

    err.message = err.message || "Internal Server error"
    err.statusCode = err.statusCode || 500

    if(err.name == "CastError"){

        const message = `Resouce not Found`
        err = new ErrorHandler(message , 400)
    }

    if(err == "BSONTypeError"){

        const message = `Invalid Object Id`
        err = new ErrorHandler(message , 400)
    }

    if(err.code == 11000){
        const message = `duplicate Id`
        err = new ErrorHandler(message , 400)
    }

    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
}

module.exports = errorMiddleware