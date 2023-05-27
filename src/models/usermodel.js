const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const phone_regex = /^[6789]{1}[0-9]{9}$/

const userSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true , "Plaese Enter Title"],
        enum: ["Mr", "Mrs", "Miss"]
    },
    name: {
        type: String,
        required: [true , "Please Enter Name"],
        minLength : [2 , "Name Should be minimum 2 caharacter"],
        maxLength : [20 , "Name Should be maximum 20 caharacter"]
    },
    phone: {
        type: String,
        required: [true, "Plaese Enter Phone No" ],
        unique: true,
        match : [phone_regex , "Invalid Phone No"]
    },
    email: {
        type: String,
        required: [true , "Please Enter Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    password: {
        type: String,
        required: [true , "Please Enter Pasword"],
        validate: [validator.isStrongPassword, "Please Enter a Strong Password"],
        select : false
    },
    address: {
        street: { type: String },
        city: { type: String },
        pincode: { type: String },
    },
    role : {
        type:String,
        enum : ["author" , "user"],
        required : [true , "Please Enter User-role"]
    },
    createdAt : {
        type :Date,
        default : Date.now()
    }
})

userSchema.pre("save" , async function(){

    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password , 10)
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password)
}


module.exports = mongoose.model('user', userSchema)