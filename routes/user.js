const { Router } = require("express");
const { register } = require("../controllers/user");
const { validateCreateRequest} = require("../middleware/validate")
const router = Router();

router.route("/sign-up").post(validateCreateRequest("user") ,register);

module.exports = router;