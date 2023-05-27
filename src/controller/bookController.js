const Book = require("../models/bookModel.js");
const Review = require("../models/reviewModel.js")
const moment = require("moment")
const ErrorHandler = require("../utils/errorHandler")
const mongoose = require("mongoose")
const validator = require('validator');
const ApiFeatures = require("../utils/ApiFeatures.js");
const cloudinary = require("cloudinary");



const createBooks = async function (req, res, next) {

    try {

        req.body.userId = req.user._id

        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = req?.body

        if (!validator.isDate(releasedAt)) {
            return next(new ErrorHandler("RealisedAt Must be in the format of YYYY-MM-DD", 400))
        }

        if (!(moment(releasedAt).isBefore(moment().format()))) {
            return next(new ErrorHandler("Please Provide Past date", 400))
        }

        const file = req.files?.photo

        if(typeof file == "undefined"){
            return next(new ErrorHandler("Please Provide bookCover" , 400))
        }

        const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder: "bookCover",
            width: 150,
            crop: "scale",
        })

        const book = await Book.create({
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            releasedAt,
            bookCover: {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            }
        })

        return res.status(201).json(
            {
                status: true,
                msg: "Book detail is successfully registered",
                book
            })

    } catch (err) {
        return next(new ErrorHandler(err, 500))
    }
}

const getallBook = async function (req, res, next) {

    try {

        const apiFeatures = new ApiFeatures(Book.find(), req.query).search()

        const book = await apiFeatures.query.select({ title: 1, excerpt: 1, category: 1, subcategory: 1, releasedAt: 1 }).sort({ title: 1 })

        if (book.length == 0) {
            return next(new ErrorHandler("No Book Found", 400))
        }

        res.status(200).json({
            success: true,
            msg: "Books List",
            book
        })
    }
    catch (err) {
        return next(new ErrorHandler(err, 500))
    }
}

const getBooksById = async function (req, res, next) {

    try {

        const bookId = req?.params?.bookId;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return next(new ErrorHandler("Invalid BookId", 400))
        }

        const book = await Book.findOne({
            _id: bookId,
            isDeleted: false
        }).select({ __v: 0, ISBN: 0 }).lean()

        if (!book) {
            return next(new ErrorHandler("No Book Found", 400))
        }

        const bookReview = await Review.findOne({
            bookId: book._id,
            isDeleted: false
        }).select({ isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })

        bookReview == null ? book["reviewData"] = [] : book["reviewData"] = bookReview

        return res.status(200).json({
            status: true,
            message: "Books list",
            book
        })

    } catch (error) {
        return next(new ErrorHandler(err, 500))
    }
}


const updatebooks = async function (req, res, next) {

    try {

        let bookId = req?.params?.bookId;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return next(new ErrorHandler("Invalid Book Id"))
        }

        let book = await Book.findOne({ _id: bookId, isDeleted: false });

        if (!book) {
            return next(new ErrorHandler("No Book is Found", 400))
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler("User is Not valid for this access", 401))
        }

        if (Object.keys(req?.body)?.length == 0) {
            return res.status(200).send({
                status: true,
                msg: "No such thing You are Update",
                book
            })
        }

        let { title, excerpt, ISBN, releasedAt } = req.body;
        let updatedProperty = {}

        if (title) {
            updatedProperty["title"] = title
        }
        if (excerpt) {
            updatedProperty["excerpt"] = excerpt
        }
        if (ISBN) {
            updatedProperty["ISBN"] = ISBN
        }

        if (releasedAt) {
            if (!(moment(releasedAt).isBefore(moment().format()))) {
                return next(new ErrorHandler("Please Provide Past date", 400))
            }
            updatedProperty["releasedAt"] = releasedAt
        }

        if (req.files) {

            const imageId = book?.bookCover?.public_id

            await cloudinary.v2.uploader.destroy(imageId);

            const file = req.files.photo

            const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
                folder: "bookCover",
                width: 150,
                crop: "scale",
            })

            updatedProperty.bookCover = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }

        book = await Book.findOneAndUpdate({ _id: bookId }, { $set: updatedProperty }, {
            new: true,
            runValidator: true
        })

        res.status(200).json({
            sucess: true,
            message: "Succufully Book Updated",
            book
        })

    } catch (err) {
        return next(new ErrorHandler(err, 500))
    }
}


const deletebyId = async function (req, res, next) {

    try {

        let bookId = req?.params?.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return next(new ErrorHandler("Invalid bookId", 400))
        }

        let book = await Book.findOne({ _id: bookId, isDeleted: false })

        if (!book) {
            return next(new ErrorHandler("No Book Found", 400))
        }

        if (book.userId.toString() !== req.user._id.toString()) {
            return next(new ErrorHandler("User is Not valid for this access", 401))
        }

        const imageId = book?.bookCover?.public_id;

        await cloudinary.v2.uploader.destroy(imageId);

        book = await Book.findOneAndUpdate(
            { _id: bookId, isDeleted: false },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            {
                new: true,
                runValidators: true
            }
        )

        await Review.findOneAndUpdate(
            { bookId: bookId, isDeleted: false },
            { $set: { isDeleted: true } },
            {
                new: true,
                runValidators: true
            }
        )

        return res.status(200).json({
            success: true,
            message: "Successfully Document Deleted"
        })

    } catch (err) {
        return next(new ErrorHandler(err, 500))
    }
}

module.exports = { createBooks, deletebyId, getallBook, getBooksById, updatebooks }


