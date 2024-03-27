const express = require("express");
const router = express.Router();

//import controller and middleware
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
} = require("../controllers/Profile");
const { auth, } = require("../middlewares/auth");


router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
router.put("/updateDisplayPicture",auth, updateDisplayPicture);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);


module.exports = router;