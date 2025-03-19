const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler"); // Import the middleware
const {
  register,
  login,
  logout,
  sendResetPasswordCode,
  resetPassword,
  validateRegister,
} = require("../controllers/user");

const {
  validateCreateRequest,
  authenticateToken,
} = require("../middleware/validate");

const router = Router();

router.route("/sign-up").post(validateCreateRequest("user"), asyncHandler(register));
router.route("/verify-email").post(asyncHandler(validateRegister));
router.route("/sign-in").post(asyncHandler(login));
router.route("/logout").post(authenticateToken, asyncHandler(logout));
router.route("/forgot-password").post(asyncHandler(sendResetPasswordCode));
router.route("/reset-password").post(asyncHandler(resetPassword));

module.exports = router;
