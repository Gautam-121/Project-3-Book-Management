const express = require("express")
const router = express.Router()
const {createBooks , getallBook , getBooksById , updatebooks , deletebyId } = require("../controller/bookController")
const {isAuthenticate , authorized} = require("../middleware/auth")

//=============================== Registered a book ==================================//
router.post("/books", isAuthenticate, authorized("author") , createBooks)

//=============================== Get list of book ==================================//
router.get("/books", getallBook)
router.get("/books/:bookId" ,  getBooksById)

//=============================== update book ==================================//
router.put("/books/:bookId",isAuthenticate, authorized("author") , updatebooks)

//=============================== Delete Book ==================================//
router.delete("/books/:bookId" , isAuthenticate ,authorized("author"), deletebyId)


module.exports = router
