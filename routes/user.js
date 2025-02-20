const { Router } = require("express");
const { register, login } = require("../controllers/user");
const { validateCreateRequest} = require("../middleware/validate")
const router = Router();

router.route("/sign-up").post(validateCreateRequest("user") ,register);
router.route("/sign-in").post(login);

module.exports = router;