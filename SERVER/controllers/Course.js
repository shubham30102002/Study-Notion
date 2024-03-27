const Course = require("../models/Course");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const Category = require("../models/Category");

//createCourse handler
exports.createCourse = async (req, res) => {
    try {
        //data fetch
        const { courseName, courseDescription, whatYouWillLearn, price, tag, category } = req.body;

        //get thumbnail
        const thumbnail = req.files.thumbnailImage;

        //validation 
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details -> ", instructorDetails);
        //TODO : Verify that userId and instructorDetails._id is same or diff

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            })
        }

        //check given tag is valid or not
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category Details Not Found",
            });
        }

        //upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        //create an entry for new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })
        console.log("New Course -> ", newCourse);

        //add the new course to user schema of instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    course: newCourse._id,
                }
            },
            { new: true },
        )

        //update the tag schema
        //TODO : Homework
        // Add the new course to the Categories
        await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                    course: newCourse._id,
                },
            },
            { new: true }
        );
        //return respose
        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create course",
            error: error.message,
        })

    }
}


//getAllCourse
exports.getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        }).populate("instructor")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses,
        })



    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot fetch the course data",
            error: error.message,
        })
    }
}


//getCourseDetails
exports.getCourseDetails = async (req, res) => {
    try {
        //get courseId
        const { courseId } = req.body;
        //find course details
        const courseDetails = await Course.find({ _id: courseId })
            .populate(
                {//nested populate query
                    path: "instructor",
                    populate: {
                        path: "additionalDetails",
                    },
                }
            )
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();
        //validation 
        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`,
            });
        }
        //return response
        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot fetch the course details",
            error: error.message,
        })
    }
}