const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader")

exports.updateProfile = async (req, res) => {
    try {
        //get data
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        //get userID
        const id = req.user.id;
        //validation
        if (!contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                message: "All field are required",
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();

        //return response
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails,
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to create sub section, please try again",
            error: error.message,
        })
    }
}

//deleteAccount
//Explore -> how can we schedule this deletion operation
exports.deleteAccount = async (req, res) => {
    try {
        //get id
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        //delete profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails })
        //TODO: unenroll user from all user courses
        //user delete
        await User.findByIdAndDelete({ _id: id });
        //return response
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Cannot delete user account, please try again",
            error: error.message,
        })
    }
}

exports.getAllUserDetails = async (req, res) => {
    try {
        //get user id
        const id = req.user.id;
        //validation
        //db call to get data
        const userDetails = await User.findById(id).population("additionalDetails").exec();
        console.log("User details -> ", userDetails);
        //return response
        return res.status(200).json({
            success: true,
            message: "User data fetched successfully",
        });

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Cannot delete user account, please try again",
            error: error.message,
        })
    }
}


exports.updateDisplayPicture = async (req, res) => {
    try {
        //get display picture
        const displayPicture = req.files.displayPicture;
        //get user id
        const userId = req.user.id;
        //update image to cloudinary
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            100
        )
        console.log(image);
        //update the profile
        const updatedProfile = await User.findById(
            { _id: userId },
            { image: image.secure_url },
            { new: true }
        )
        //return response
        res.status(200).json({
            sucess: true,
            message: "Image updated successfully",
            data: updatedProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update the image",
            error: error.message,
        })
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
        //get user id
        const userId = req.user.id;
        //get user data 
        const userDetails = await User.findOne({ _id: userId }).populate("courses").exec();
        //validate data
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not found the user with user id: ${userId}`,
                error: error.message,
            })
        }
        //return response
        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch the courses enrolled details",
            error: error.message,
        })
    }
}