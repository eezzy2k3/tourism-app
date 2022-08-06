const {createReview,getReviews,touristReview, updateReview, deleteReview} = require("../controller/reviewcontroller")
const authorize = require("../middleware/auth")
const express = require("express")




const router = express.Router({mergeParams:true})

router.use(authorize)



router.route("/")
.get(getReviews)
.post(createReview)
.get(touristReview)

router.route("/:touristId")
.put(updateReview)
.delete(deleteReview)

module.exports = router