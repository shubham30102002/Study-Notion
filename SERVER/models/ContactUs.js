const mongoose = require("mongoose");

const contactUs = new mongoose.Schema({
    email:{
        type: String,
    },
    firstname: {
        type: String,
    },
    lastname:{
        type: String,
    },
    message: {
        type: String,
    },
    phoneno: {
        type: Number,
    },
    countrycode:{
        type: Number,
    }
})


modules.exports = mongoose.model("ContactUs", contactUs);