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
            { new: true }).populate("subSection").exec();
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

//TODO update Subsection
exports.updateSubSection = async(req,res) => {
    try{
        //fetch data
        const {title, description, timeDuration} = req.body;
        const {id} = req.params;
        //extract video
        const updatedVideo = req.files.videoFile;
        //validate
        if ( !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: "All field are required",
            });
        }
        //update data
        const updateVideo = await uploadImageToCloudinary(updatedVideo, process.env.FOLDER_NAME);
        //save changes in db 
        const SubSectionDetails = await SubSection.findByIdAndUpdate({id},{
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url,
        },{new: true});
        //return response
        return res.status(200).json({
            success: true,
            message:"Sub-section updated successfully"
        })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update sub section, please try again",
            error: error.message,
        })
    }
}


//TODO detele Subsection
exports.deleteSubSection = async(req,res) => {
    try{
        //fetch data
        const {subSectionId} = req.params;
        //delete subsection
        await SubSection.findByIdAndDelete(subSectionId);
        // delete subsection id from section 
        //return response
        return res.status(200).json({
            success: true,
            message: "Sub-section deleted successfully",
        });

    }catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to delete sub section, please try again",
            error: error.message,
        })
    }
}