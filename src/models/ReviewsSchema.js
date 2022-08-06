const mongoose  = require("mongoose")

const reviewSchema = mongoose.Schema({
    review:{
        type:String,
        required:true,
        maxLength:100
    },
    ratings:{
        type:Number,
        min:1,
        max:10,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
     },
     tourist:{
        type:mongoose.Schema.ObjectId,
        ref:"Tourist",
        required:true
     }
},{timestamps:true})

const Review = mongoose.model("Review",reviewSchema)

module.exports = Review