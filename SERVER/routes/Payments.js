const express = require("express");
const router = express.Router();

//import controller
const {capturePayment, verifySignature} = require("../controllers/Payments");
const {auth, isAdmin, isInstructor, isStudent} = require("../middlewares/auth");
 
//api routes
router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifySignature", verifySignature);

//exports
module.exports = router;