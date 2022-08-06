const User = require("../models/userSchema")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/asyncHandler")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const sendMail = require("../utils/sendMail")


const register = asyncHandler(async(req,res,next)=>{
    let {name,email,password,role} = req.body
   
    // check if email already exist
    const findUser =await User.findOne({email})
   
    if(findUser) return next(new ErrorResponse(`The email ${email} already exist`,404))
    //    hash the password
    password = await bcrypt.hash(password,12)
   
    const user = await User.create({name,email,password,role})
   
    // const token = jwt.sign({id:user._id,email:user.emai},process.env.JWT_SECRET,{expiresIn:"30d"})
   
    // send cookie and token
    sendCookie(user,201,res)
   
    // res.status(201).json({success:true,token})

})

const logIn = asyncHandler(async(req,res,next)=>{
   
    const {email,password} = req.body

    //    check for empty field(email,password)
    if(!email||!password) return next(new ErrorResponse(`enter email and password`,404))
   
   //    get a user from DB
    const user =await User.findOne({email}).select("+password")

    // if no user is found
    if(!user) return next(new ErrorResponse(`Invalid credentials`,404))
   
    // compare plain password and hashed password
    const checkPassword =await bcrypt.compare(password,user.password)
   
    //  if no matching password 
    if(!checkPassword) return next(new ErrorResponse(`Invalid credentials`,404))
   
    // send cookie and token
    sendCookie(user,200,res)
})

const sendCookie = (user,statusCode,res)=>{
 
    const token = jwt.sign({id:user._id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:"30d"})
 
    const options = ({
     expires:new Date(Date.now()+2592000),
     httpOnly:true
 })

 res.status(statusCode)
 .cookie("token",token,options)
 .json({
     success:true,
     token
 })
}

const delet = asyncHandler(async(req,res,next)=>{
   
    const id = req.user.id
   
    // find a user and delete
    await User.findByIdAndDelete(id)
    
    res.status(200).json({success:true,msg:`successfully deleted account${req.user.email}`})
})
const changePassword = asyncHandler(async(req,res,next)=>{
   
    const id = req.user.id
   
    // find a user
    const user = await User.findById(id).select("+password")
  
    let {password,newPassword} = req.body
  
    // compare user password to hashed passwprd
    const checkPassword =await bcrypt.compare(password,user.password)
   
    // no matching password
    if(!checkPassword)return next(new ErrorResponse("Invalid password",400))
  
    // hash new password   
    newPassword = await bcrypt.hash(newPassword,12)

    // update new password
   await User.findByIdAndUpdate(id,{password:newPassword},{new:true})

   res.status(200).json({success:true,msg:`password successfully changed`})
})
// get a single user
const getUser = asyncHandler(async(req,res,next)=>{
    
    const id = req.user.id
   
    // get a user from DB
    const user = await User.findById(id)
   
    res.status(200).json({success:true,data:user})
})
// generate token for reset password
const generateToken = asyncHandler(async(req,res,next)=>{
   
    const {email} = req.body
   
    const user =await User.findOne({email})
  
    // check if user exist 
    if(!user)return next(new ErrorResponse(`${email} does not exist`,404))
   
    const resetToken = jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET)
   
    user.resetToken = resetToken
   
    user.resetTokenExpire = Date.now()+86400000
   
    await user.save()
  
    //   create a message 
    const message = `click on the link to reset password :\n\n ${req.protocol}://${req.get("host")}/api/v1/user/resettoken/${user.resetToken}`
  
    //    send mail
    try {
       await sendMail({
           email:user.email,
           subject:"password reset token",
           message
       }) 
    } catch (error) {
        console.log(error.message)
        user.resetToken = undefined
        user.resetTokenExpire = undefined
        await user.save()
        next(new ErrorResponse("message could not be sent",500))
        
    }
    
    res.status(200).json({success:true,message:"token sent",data:user.resetToken})


})

// reset password
const resetPassword = asyncHandler(async(req,res,next)=>{
    const token = req.params.token
   
    let password = req.body.password
 
    //    get a user with sent token and check if still valid
    const user =await User.findOne({resetToken:token,resetTokenExpire:{$gt:Date.now()}})
 
    // check if token is valid   
    if(!user) return next(new ErrorResponse("Invalid token",400))
    
    //  hash new password  
    password =await bcrypt.hash(password,12)
  
    //  set new password 
    user.password = password
   
    // delete resettoken and resettokenexpire
    user.resetToken = undefined
   
    user.resetTokenExpire = undefined
  
    //  save modifications
    await user.save()
   
    res.status(201).json({success:true,msg:"password reset successful"})
})

module.exports = {register,logIn,delet,changePassword,getUser,generateToken,resetPassword}