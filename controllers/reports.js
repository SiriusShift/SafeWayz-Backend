const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {uploadBase64ToS3} = require("../services/awsS3");

const submitReport = async (req, res, next, io) => {
    const {frontImage, backImage, lat, lng, date} = req.body    
    try{
        if(!frontImage || !backImage){
            res.status(400).json({
                message: "Image is required"
            })
        }
        const back = await uploadBase64ToS3(backImage, `back-${Date.now()}-${req.user.id}`)
        const front = await uploadBase64ToS3(frontImage, `front-${Date.now()}-${req.user.id}`)
        const newReport = await prisma.reports.create({
            data: {
                frontCamera: front,
                backCamera: back,
                userId: req.user.id,
                latitude: lat,
                longitude: lng,
                date: date,
                ...(req.body.type && {type: req.body.type}),
                ...(req.body.severity && {severity: req.body.severity}),
                ...(req.body.description && {description: req.body.description}),
                ...(req.body.type && {type: req.body.type}),
                ...(req.body.severity && {severity: req.body.severity}),
                ...(req.body.injuries && {description: req.body.injuries}),
                ...(req.body.reported && {description: req.body.reported}),
            }
        })
        console.log(newReport);
        io.emit("new_report", newReport);
        res.status(200).json({
            message: "Report submitted successfully"
        })
    }catch(err){
        console.log(err)
    }
}

const getReports = async (req, res, next) => {
    try {
        const oneHourAgo = new Date();
        oneHourAgo.setUTCHours(oneHourAgo.getUTCHours() - 3); // Use UTC time

        const reports = await prisma.reports.findMany({
            where: {
                createdAt: {
                    gte: oneHourAgo
                }
            },
            include: {
                user: true
            }
        });

        res.status(200).json(reports);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error retrieving reports" });
    }
};


module.exports = {
    submitReport,
    getReports
}