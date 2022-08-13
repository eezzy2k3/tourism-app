const {createReview,getReviews,updateReview, deleteReview, getSingleReview} = require("../controller/reviewcontroller")
const authorize = require("../middleware/auth")
const express = require("express")




const router = express.Router({mergeParams:true})

router.use(authorize)



router.route("/")
.get(getReviews)
.post(createReview)

router.route("/:id")
.put(updateReview)
.delete(deleteReview)
.get(getSingleReview)

module.exports = router