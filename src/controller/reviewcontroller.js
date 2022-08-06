const Review = require("../models/ReviewsSchema")
const Tourist = require("../models/touristcenterschema")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")

// desc => create a new review
// route => POST/api/v1/tourist/:touristId/review

const createReview = asyncHandler(async(req,res,next)=>{
    
    const tourist = req.params.touristId
    const user = req.user.id

    // only user and admin can create review
    if(req.user.role != "user" && req.user.role != "admin") return next(new ErrorResponse("unauthorize",400))

    // check if tourist exist
    const checkTourist = await Tourist.findById(tourist)
   
    if(!checkTourist) return next(new ErrorResponse(`no tourist with id ${tourist}`,404))

    req.body.tourist = tourist
    req.body.user = user

    // create new review
    review = await Review.create(req.body)

    res.status(201).json({success:true,data:review})
})

// desc => get all review
// route => GET/api/v1/reviews

const getReviews = asyncHandler(async(req,res,next)=>{
   
    // get all review in DB
    const reviews =await Review.find({}).populate({path:"tourist",select:"touristCenter description"})

    res.status(201).json({success:true,count:reviews.length,data:reviews})
})


// desc => get all review for a tourist center
// route => GET/api/v1/tourist/:touristId/review

const touristReview = asyncHandler(async(req,res,next)=>{
    const tourist = req.params.touristId

    // check if tourist center exist
    const checkTourist = await Tourist.findById(tourist)
   
    if(!checkTourist) return next(new ErrorResponse(`no tourist with id ${tourist}`,404))

    // get review for a specific tourist center
    const reviews = await Review.find({tourist}).populate({path:"tourist",select:"touristCenter description"})


    res.status(200).json({success:true,count:reviews.length,data:reviews})
})

// desc => update review
// route => put/api/v1/reviews/:touristId

const updateReview = asyncHandler(async(req,res,next)=>{

    // get the review from db
    let review = await Review.findById(req.params.touristId)
   
    // check if the review is in DB
    if(!review) return next(new ErrorResponse(`no review with id ${req.params.touristId}`,404))

    // check the creator is the one updating
    if(req.user.id!=review.user)return next(new ErrorResponse(`you cant update review you did not create`,401))
    
    // update review
     review = await Review.findByIdAndUpdate(req.params.touristId,req.body,{new:true})

     res.status(200).json({success:true,data:review})

    
})

const deleteReview = asyncHandler(async(req,res,next)=>{

    // get the review from db
    let review = await Review.findById(req.params.touristId)
   
    // check if the review is in DB
    if(!review) return next(new ErrorResponse(`no review with id ${req.params.touristId}`,404))

    // check the creator is the one updating
    if(req.user.id!=review.user)return next(new ErrorResponse(`you cant delete review you did not create`,401))
    
    // update review
     await Review.findByIdAndDelete(req.params.touristId)

     res.status(200).json({success:true,msg:`successfully deleted review with id${req.params.touristId}`})

    
})




module.exports = {createReview,getReviews,touristReview,updateReview,deleteReview}

