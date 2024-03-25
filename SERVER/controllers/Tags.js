const Tag = require("../models/Tags");

//create tag handler function
exports.createTag = async(req,res) => {
    try{
        //fetch data
        const {name,description} = req.body;
        //validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message: "All fields are required",
            })
        }
        //create entry in db
        const tagDetails = await Tag.create({
            name: name,
            description: description,
        })
        console.log("Tag details-> ",tagDetails);

        //return response
        return res.status(200).json({
            success:true,
            message: "Tag created successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}

//getAllTags
exports.showAllTags = async(req,res) => {
    try{
        const allTags = await Tag.find({},{name:true, description:true});
        return res.status(200).json({
            success:true,
            message: "All tags return successfully",
        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message: error.message,
        })
    }
}

