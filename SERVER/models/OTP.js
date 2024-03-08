const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");

const OTPSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60,
    }
});

//a function - to send email
async function sendVerficationEmail(email, otp){
    try{
        const mailResponse = await mailSender(email,"Verfication Email from StudyNotion", otp)
        console.log("Email send successfully: ", mailResponse);

    }catch(error){
        console.log("Error occured while sending mail");
       throw error;
    }
} 

// next is a function that is passed as an argument to the middleware function that is executed before saving data
OTPSchema.pre("save", async function(next){
    await sendVerficationEmail(this.email, this.otp);
    next();
})



module.exports = mongoose.model("OTP", OTPSchema);