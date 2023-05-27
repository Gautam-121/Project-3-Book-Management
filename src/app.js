const express = require("express")
const app = express()
const cors = require("cors")
const cookieParser = require("cookie-parser")
const fileUpload = require("express-fileupload");

const errorMiddleware = require("./middleware/errorMiddleware")


app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles : true
}))

const userRouter = require("./routes/userRouter")
const bookRouter = require("./routes/bookRouter")
const reviewRouter = require("./routes/reviewRouter")

app.use("/api/v1" , userRouter)
app.use("/api/v1" , bookRouter)
app.use("/api/v1" , reviewRouter)

app.use(errorMiddleware)

module.exports = app


