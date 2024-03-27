const express = require("express");
const app =express();
require("dotenv").config(); //loading env variables
const database = require("./config/database");
const {cloudinaryConnect} =  require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

//Finding port no
const PORT = process.env.PORT || 4000;

//Connecting database
database.connect();

//cloudinary connection
cloudinaryConnect();

//middleware
app.use(express.json());
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
app.use(cookieParser());

//api mount


//routes


//server start
app.listen(PORT , () => {
    console.log(`App started at port no. ${PORT}`);
});


//default route for testing
app.get("/" , (req,res) => {
    res.send("<h1>APP RUNNING SUCCESSFULLY</h1>");
})
