const Review = require("../models/reviewModel")
const Book = require("../models/bookModel")
const { default: mongoose } = require("mongoose")
const ErrorHandler = require("../utils/errorHandler")

const createAndUpdate = async (req , res , next)=>{

    try{

        const bookId = req?.params?.bookId

        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return next(new ErrorHandler("Invalid BookId" , 400))
        }

        let book = await Book.findOne({_id : bookId , isDeleted : false})

        if(!book){
            return next(new ErrorHandler("No Book found",400))
        }

        const {rating , comment} = req.body

        if(!rating || !comment){
            return next(new ErrorHandler("Please Provide rating and Comment" , 400))
        }

        if(rating < 1  || rating > 5){
            return next(new ErrorHandler("Rating must be Between 1-5"))
        }

        const reviews = {
            user : req?.user?._id,
            name : req?.user?.name,
            reviewedAt : new Date(),
            rating,
            comment
        }

        const allReview = await Review.findOne({bookId : bookId , isDeleted : false})

        if(!allReview){

            await Review.create({
                bookId,
                reviews
            })

            book.numOfReviews = 1
            book.ratings = rating

            book = await book.save({validateBeforeSave : false})

            return res.status(200).json({
                success : true,
            })
        }

        const isReviewed = allReview?.reviews?.find(
            rev => rev.user.toString() === req.user._id.toString()
        )

        if(isReviewed){

            allReview?.reviews?.forEach(rev => {

                if(rev?.user?.toString() == req?.user?._id?.toString()){
                    rev.rating = rating
                    rev.comment = comment
                }
            });
        }
        else{
            allReview?.reviews?.push(reviews)
            book.numOfReviews = book.numOfReviews + 1
        }

        let avg = 0;

        allReview?.reviews?.forEach(rev => {

            avg+=rev.rating
        })

        book.ratings = Math.round(avg/allReview?.reviews?.length)

        await book.save()
        await allReview.save()

        res.status(200).json({
            success : true
        })

    }catch(err){
        return next(new ErrorHandler(err , 500))
    }
}

const getBookReview = async(req , res , next) => {

    try{

        const bookId = req?.params?.bookId

        if(!mongoose.Types.ObjectId.isValid(bookId)){
            return next(new ErrorHandler("Invalid BookId" , 400))
        }

        const bookReview = await Review.findOne(
            {bookId : bookId , isDeleted : false})
            .populate("bookId" , ['title', 'excerpt', 'category', 'numOfReviews' , 'ratings'] )

        if(!bookReview){
            return next(new ErrorHandler("No review for Book",400))
        }

        res.status(200).json({
            success : true,
            bookReview
        })

    }catch(err){
        return next(new ErrorHandler(err , 500))
    }
}

const deleteReview = async function (req, res , next) {

    try {
        
       let {bookId , userId} = req?.params

       if(!mongoose.Types.ObjectId.isValid(bookId)){
        return next( new ErrorHandler( "Invalid BooId" , 400))
       }

       let book = await Review.findOne({bookId : bookId , isDeleted : false})

        if (!book){
            return next(new ErrorHandler("No Such book present or book already deleted" , 400))
        }

        if(!mongoose.Types.ObjectId.isValid(userId)){
            return next( new ErrorHandler( "Invalid BooId" , 400))
        }

        if(req.user._id.toString() !== userId.toString()){
            return next(new ErrorHandler("User is Not valid for this access" , 401))
        }
    
        let filterReview = book.reviews.filter(rev => {
            return rev.user.toString() !== req.user._id.toString()
        })

        if(book.reviews?.length === filterReview.length){
            return next(new ErrorHandler("You not review Yet" , 400))
        }

        let avg = 0;

        filterReview.forEach(rev => {
            avg+=rev.rating
        })

        const ratings = avg/filterReview.length
        const numOfReviews = filterReview.length

      book  = await Book.findOneAndUpdate( 
        { _id : bookId , isDeleted: false}, 
        {$set: { ratings , numOfReviews} }, 
        { new: true ,
          runValidators : true
        })

        await Review.findOneAndUpdate(
        { bookId : bookId , isDeleted: false}, 
        {$set: {reviews : filterReview} }, 
        { new: true ,
          runValidators : true
        })
      
      return res.status(200).json(
        { 
            status: true, 
            msg: "Review Document successfully deleted" 
        });
    }
    catch (err) {
        return next(new ErrorHandler(err , 500))
    }
}
        

 module.exports = { createAndUpdate , getBookReview , deleteReview}