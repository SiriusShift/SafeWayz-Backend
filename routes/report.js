const { Router } = require("express");
const { authenticateToken } = require("../middleware/validate");
const { submitReport, getReports } = require("../controllers/reports");

const ReportRouter = (io) => {
    const router = Router();

    // Pass `io` correctly using an arrow function
    router.route("/createReport").post(authenticateToken, (req, res, next) => submitReport(req, res, next, io));
    router.route("/getReports").get(authenticateToken, (req, res, next) => getReports(req, res, next));

    return router;
};

module.exports = ReportRouter;