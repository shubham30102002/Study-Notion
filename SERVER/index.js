const express = require("express");
const app =express();
require("dotenv").config(); //loading env variables
const database = require("./config/database");
const {cloudinaryConnect} =  require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");


//Finding port no
const PORT = process.env.PORT || 4000;

//Connecting database
database.connect();

//cloudinary connection
cloudinaryConnect();

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp'
}));
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
)

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);


//default route for testing
app.get("/" , (req,res) => {
    return res.json({
        success: true,
        message: "Your server is up and running..."
    })
})

//server start
app.listen(PORT , () => {
    console.log(`App is running at ${PORT} port`);
});

