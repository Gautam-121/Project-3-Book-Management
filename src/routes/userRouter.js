const express = require("express")
const router = express.Router()
const {createUser , loginuser} = require("../controller/userController")

//=============================== CreateUser=======================================//
router.post("/register", createUser)

//================================= LoginUser =======================================//
router.post("/login", loginuser)

module.exports = router