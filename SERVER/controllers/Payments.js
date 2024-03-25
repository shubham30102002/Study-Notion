const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {

    //get courseId and userId
    const { courseId } = req.id;
    const userId = req.user.id;
    //validation
    //validate courseId
    if (!courseId) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid course ID",
        })
    }
    //validate courseDetails
    let course;
    try {
        course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({
                success: false,
                message: "Could not found the course",
            })
        }
        //user already pay for the smae course check
        const uid = new mongoose.Types.ObjectId(userId); //string to objectID
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled",
            })
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
    //order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        receipt: Math.random(Date.now()).toString(),
        notes: {
            courseId: courseId,
            userId,
        }
    };

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log("Payment response -> ", paymentResponse);
        //return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Could not initiate the order"
        })
    }

}


//verify signature of razorpay and server
exports.verifySignature = async (req, res) => {
    const webhookSecret = "12345678";

    const signature = req.header("x-razorpay-signature");

    const shasum = crypto.createHmac("sha256", webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    //match digest and signature
    if (signature === digest) {
        console.log("Payment is Authorized");

        //now notes is used to access courseid and userid
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        try {
            //fullfil action -> find the course and enroll the student in it
            const enrollCourse = await Course.findOneAndUpdate(
                { _id: courseId },
                {
                    $push: {
                        studentsEnrolled: userId,
                    }
                },
                { new: true });
            if (!enrollCourse) {
                return res.status(404).json({
                    success: false,
                    message: "Course Not Found"
                })
            }

            console.log("Enroll Course -> ", enrollCourse);

            //find the student and add course in list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate(
                { _id: userId },
                {
                    $push: {
                        courses: courseId
                    }
                },
                { new: true }
            )
            console.log("Enroll Student -> ", enrolledStudent);
            //mail send karna 
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Congratulations from StudyNotion",
                "Congratulations, you are emboarded into new StudyNotion new course",
            );
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature verified and course is added",
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message,
            })
        }
    }else{
        return res.status(500).json({
            success: false,
            message: "Invalid request",
        })
    }
}