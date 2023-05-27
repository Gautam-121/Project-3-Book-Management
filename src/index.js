const app = require("./app.js")
const dotenv = require("dotenv")
const connection = require("./config/mongoseConnection.js")
const cloudinary = require("cloudinary");


process.on("uncaughtException" , (err)=>{
    console.log(`Error is ${err}`)
    console.log(`Shutting Down due to Uncaught Exception error`)

    process.exit(1)
})

//Set environment Configration
dotenv.config({path : "src/config/.env"})

//Made connection with mongoDb
connection()

//Cloudanary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const server =  app.listen(process.env.PORT || 4000 , ()=>{
    console.log(`Listening On Port ${process.env.PORT || 4000}`)
})

process.on("unhandledRejection", (err)=>{
    console.log(`Error is ${err}`)
    console.log(`Shutting Down due to Unhandled Promised Rejection`)

    server.close(()=>{
        process.exit(1)
    })
})

