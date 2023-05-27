const mongoose = require('mongoose');
const validator = require('validator');
const ObjectId = mongoose.Schema.Types.ObjectId


const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true , "Please Enter Title"],
        unique: true,
        trim : true
    },
    excerpt: { 
        type: String, 
        required: [true , "Please Enter excerpt" ] 
    },
    userId: {
        type: ObjectId,
        ref: "user",
        required: true
    },
    ISBN: {
        type: String, 
        required: [true , "Plaese Enter ISBN"], 
        unique: true,
        validate: [validator.isISBN , "Please Enter a valid ISBN charcter 10 or 13"],
    },
    category: { 
        type: String, 
        required: [true , "Please Enter category"]
    },
    subcategory: { 
        type: String,
        required: [true , "Plaese Enter subCategogy"] 
    },
    numOfReviews: { 
        type: Number, 
        default: 0
    },
    ratings:{
        type:Number,
        default:0
    },
    deletedAt: { type: Date },
    isDeleted: {
        type: Boolean,
        default: false 
    },
    releasedAt: { 
        type: Date, 
        required: [true , "Plaese Mention Reaseled Date"],
    },
    bookCover: { 

        public_id : {
            type:String,
            required:true
        },
        url: {
            type:String,
            required:true
        }
    },
    createdAt : {
        type : Date,
        default : new Date()
    }
});


module.exports = mongoose.model("book" , bookSchema)
