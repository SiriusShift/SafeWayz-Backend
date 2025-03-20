const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler"); // Import the middleware
const {
  register,
  login,
  logout,
  sendResetPasswordCode,
  resetPassword,
  validateRegister,
  updateUserDetails,
} = require("../controllers/user");

const {
  validateCreateRequest,
  authenticateToken,
} = require("../middleware/validate");

const router = Router();

router.route("/sign-up").post(validateCreateRequest("user"), register);
router.route("/verify-email").post(validateRegister);
router.route("/sign-in").post(login);
router.route("/logout").post(authenticateToken, logout);
router.route("/forgot-password").post(sendResetPasswordCode);
router.route("/reset-password").post(resetPassword);
router.route("/updateUserDetails").patch(authenticateToken, updateUserDetails);

module.exports = router;
