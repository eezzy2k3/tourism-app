require("dotenv").config()
const touristRouter = require("./src/router/touristRoute")
const userRouter = require("./src/router/userRoute")
const bookingRouter = require("./src/router/bookingRoute")
const reviewRouter = require("./src/router/reviewRoute")
const errorHandler = require("./src/middleware/errorHandler")
const cookieParser = require("cookie-parser")

const express = require("express")
const app = express()
const connectDb = require("./config/config")
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/v1/tourist",touristRouter)
app.use("/api/v1/user",userRouter)
app.use("/api/v1/booking",bookingRouter)
app.use("/api/v1/reviews",reviewRouter)

app.use(errorHandler)



connectDb()
const port = 5000
app.listen(port||PORT,()=>{
    console.log(`app is listening on port ${port}`)
})