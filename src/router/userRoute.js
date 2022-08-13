const  {register,getUser,deleteuser,updateUser,getAllUser} = require("../controller/user")
const authorize = require("../middleware/auth")
const express = require('express')



const router = express.Router()

router.route("/:id")
.get(authorize,getUser)
.delete(authorize,deleteuser)
.put(authorize,updateUser)

router.route("/")
.get(authorize,getAllUser)
.post(authorize,register)

module.exports = router