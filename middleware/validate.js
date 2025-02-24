require("dotenv").config();
const { signupSchema } = require("../schema/user");
const {decryptString} = require("../utils/customFunction")
const ExpressError = require("../utils/expressError")
const validateCreateRequest = (requestType) => {
  return (req, res, next) => {
    let error;
    console.log(req.body)
    switch (requestType) {
      case "user":
        error = signupSchema.validate(req.body).error;
        break;
      default:
        console.log(`No validation for ${requestType}`);
    }
    if (error) {
        const msg = error.details.map((el) => el.message).join(",");
        // Instead of throwing an error directly, call next with the error
        throw new ExpressError(msg, 400);
      } else {
        next(); // If no error, call next
      }
  };
};

module.exports = {
    validateCreateRequest
}
