const { Router } = require("express");
const { authenticateToken } = require("../middleware/validate");
const { submitReport } = require("../controllers/reports");
const router = Router();

router.route("/createReport").post(authenticateToken, submitReport);

module.exports = router;