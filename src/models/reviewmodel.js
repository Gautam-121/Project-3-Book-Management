const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

  bookId: {
    type: ObjectId,
    ref: "book",
    required: true
  },

  reviews : [
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "user",
            required : true
        },
        name : {
            type :String,
            required : true
        },
        rating : {
            type : Number,
            required : true,
        },
        comment : {
            type : String,
            required : true
        },
        reviewedAt: { 
          type: Date, 
          required: true
        },
    }
],

isDeleted: { type: Boolean, default: false },

createdAt : {
  type : Date,
  default : new Date()
}

});


module.exports = mongoose.model('review', reviewSchema)