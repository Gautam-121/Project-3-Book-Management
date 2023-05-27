const express = require("express")
const router = express.Router()
const {createAndUpdate , getBookReview  , deleteReview} = require("../controller/reviewController")
const {isAuthenticate} = require("../middleware/auth")

//CreateReview
router.post("/books/:bookId/review",isAuthenticate , createAndUpdate)

//GetReviews
router.get("/book/:bookId/getBookReview" ,isAuthenticate ,  getBookReview)

//deleteReview
router.delete("/books/:bookId/review/:userId" , isAuthenticate , deleteReview)

module.exports = router