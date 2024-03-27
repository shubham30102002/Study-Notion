const express = require("express");
const router = express.Router();

//import controller and middleware

//course conteoller
const {createCourse, getCourseDetails, getAllCourses}= require("../controllers/Course");

//category controller
const {showAllCategories, createCategory, categoryPageDetails} = require("../controllers/Category")


//section controller
const {createSection, updateSection, deleteSection, } = require("../controllers/Section");

//subsection controller
const {createSubSection, updateSubSection, deleteSubSection} = require("../controllers/Subsection");

//Rating controller 
const {createRating,getAverageRating, getAllRating} = require("../controllers/RatingAndReview");

//import middleware
const {auth, isAdmin, isInstructor, isStudent} = require("../middlewares/auth");

//api routes
//section routes
router.post("/createCourse",auth, isInstructor, createCourse);
router.post("/addSection",auth, isInstructor, createSection);
router.put("/updateSection",auth, isInstructor, updateSection);
router.delete("/deleteSection",auth, isInstructor, deleteSection);

//subsection
router.post("/addSubSection",auth, isInstructor, createSubSection);
router.put("/updateSubSection",auth, isInstructor, updateSubSection);
router.delete("/deleteSubSection",auth, isInstructor, deleteSubSection);

//get details
router.get("/getAllCourses",getAllCourses);
router.get("/getCourseDetails",getCourseDetails);

//cateogry router (can only be created by admin)
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories",showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

//Rating and Reviews
router.post("/createRating",auth,isStudent,createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

//export
module.exports = router;