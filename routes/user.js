const { Router } = require("express");
const { register, login, logout, sendResetPasswordCode, resetPassword, validateRegister } = require("../controllers/user");
const {
  validateCreateRequest,
  authenticateToken,
} = require("../middleware/validate");
const router = Router();

router.route("/sign-up").post(validateCreateRequest("user"),register);
router.route("/verify-email").post(validateRegister)
router.route("/sign-in").post(login);
router.route("/logout").post(authenticateToken, logout);
router.route("/forgot-password").post(sendResetPasswordCode);
router.route("/reset-password").post(resetPassword);

module.exports = router;
