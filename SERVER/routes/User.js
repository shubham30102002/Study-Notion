const express = require("express");
const router = express.Router();

//import controller and middleware
const {
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controllers/Auth")

const {resetPasswordToken, resetPassword} = require("../controllers/ResetPassword");
const {auth} = require("../middlewares/auth");


//api routes
router.post("/login", login);
router.post("/signUp", signUp);
router.post("/sendOTP", sendOTP);
router.post("/changePassword", auth, changePassword);
//----->Reset password
router.post("/reset-password-token", auth, resetPasswordToken);
router.post("/reset-password",auth,resetPassword);


//export
module.exports = router
