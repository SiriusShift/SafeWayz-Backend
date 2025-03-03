require("dotenv").config();
const { signupSchema } = require("../schema/user");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { decryptString } = require("../utils/customFunction");
const ExpressError = require("../utils/expressError");
const jwt = require("jsonwebtoken");
const validateCreateRequest = (requestType) => {
  return (req, res, next) => {
    let error;
    console.log(req.body);
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

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    // Check token in DB
    const storedToken = await prisma.accessToken.findFirst({
      where: {
        userId: decoded.id,
        tokenHash: token,
      },
    });

    if (!storedToken) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // Attach decoded user data to request
    req.user = decoded;
    req.accessToken = token;

    // Proceed to next middleware/route handler
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = {
  validateCreateRequest,
  authenticateToken,
};
