const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");


//create subsection
exports.createSubSection = async (req, res) => {
    try {
        //fetch data from req body
        const { sectionId, title, timeDuration, description } = req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if (!sectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "All field are required",
            });
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create a subSection
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        })
        //update section with this sub section object id
        const updatedSection = await findByIdAndUpdate({ _id: sectionId },
            {
                $push: {
                    subSection: SubSectionDetails._id
                }
            },
            { new: true });
        //TODO: log updated section here, after adding populate query
        //return response
        return res.status(200).json({
            success: true,
            message: "Sub Section created successfully",
            updatedSection,
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

//TODO upadted Subsection


//TODO detele Subsection
