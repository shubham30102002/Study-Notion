const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");

//createRating
exports.createRating = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id;
        //fetch data from req body
        const { rating, review, courseId } = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne(
            {
                _id: courseId,
                studentsEnrolled: { $elemMatch: { $eq: userId } },
            });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            })
        }
        //check if user already reviewed the course or not
        const alreadyReviewed = await RatingAndReview.findOne({
            user: userId,
            course: courseId,
        });
        if (alreadyReviewed) {
            return res.status(403).json({
                success: false,
                message: "Course is already reviewed bu the student",
            });
        }
        //create rating and review
        const ratingReview = await RatingAndReview.create({
            rating, review,
            course: courseId,
            user: userId
        });
        //update course with this rating/review
       //TODO: find error in this code
        const updatedCourseDetails = await Course.findByIdAndUpdate({ _id: courseId },
            {
                $push: {
                    ratingAndReviews: ratingReview._id,
                }
            },
            { new: true }
        );
        console.log("Updated Course Details -> ", updatedCourseDetails);
        //return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created successfully",
            ratingReview,
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot post the rating and review, please try again",
            error: error.message,
        })
    }
}

//getAverageRating
exports.getAverageRating = async (req, res) => {
    try {
        //get course id
        const courseId = req.body.courseId;
        //cal avg rating
        const result = await RatingAndReview.aggregate([
            {//give me entry course with this id
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ])

        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                averageRating: result[0].averageRating,
            })
        }
        //if no rating review exist 
        return res.status(200).json({
            success: true,
            message: "Average rating is 0, no rating is given till now",
            averageRating: 0,
        })
        //return rating

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot get average rating, please try again",
            error: error.message,
        })
    }
}

//getAllRatingAndReviews
exports.getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            })
            .populate({
                path: "course",
                select: "courseName",
            })
            .exec();

        return res.status(200).json({
            success: true,
            message: "All reviews fetch successfully",
            data: allReviews,
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: "Cannot get average rating, please try again",
            error: error.message,
        })
    }
}