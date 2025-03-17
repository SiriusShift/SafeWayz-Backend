const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {uploadBase64ToS3} = require("../services/awsS3");

const submitReport = (req, res, next) => {
    const {frontImage, backImage} = req.body
    try{
        if(!frontImage || !backImage){
            res.status(400).json({
                message: "Image is required"
            })
        }
        console.log(req.user)
    }catch(err){
        console.log(err)
    }
}

module.exports = {
    submitReport
}