const {register,logIn,delet,changePassword,getUser, generateToken, resetPassword} = require("../controller/user")
const authorize = require("../middleware/auth")
const express = require('express')
// const cookieParser = require("cookie-parser")


const router = express.Router()
// router.use(cookieParser())
router.route("/")

.post(register)
.delete(authorize,delet)
.get(authorize,getUser)
router.post("/login",logIn)
router.put("/changepassword",authorize,changePassword)
router.post("/resetpassword",generateToken)
router.put("/resetpassword/:token",resetPassword)




module.exports = router