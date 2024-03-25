const Section = require("../models/Section");
const Course = require("../models/Course");


exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body;
        //validate data
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            })
        }
        //create section
        const newSection = await Section.create({ sectionName });
        //update course with section obj id
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true },
        );
        //TODO: use populate to add section and sub section data both in updatedCourseDetails
        // return response 
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        })

    } catch (error) {
        updatedSection
    }
}


exports.updateSection = async(req,res) => {
    try{
        //data input 
        const {sectionName, sectionId} = req.body;
        //data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            })
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName},{new: true});
        //return respose
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
        })


    }catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to update section, please try again",
            error: error.message,
        })
    }
}


exports.deleteSection = async(req,res) => {
    try{
        //get id - assuming that we sending id in params
        const {sectionId} = req.params;
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //TODO[testing] : do we need to delete the entry from the course schema???
        //return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        })
    }catch(error){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Failed to delete section, please try again",
            error: error.message,
        })
    }
}