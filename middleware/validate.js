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
  console.log(token);

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    const storedToken = await prisma.accessToken.findFirst({
      where: {
        userId: decoded.id,
        tokenHash: token,
      },
    });

    console.log("test");

    if (!storedToken) {
      return res.status(403).json({ messag: "Invalid or expired token.!" });
    }

    req.user = decoded;
    req.accessToken = token;
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = {
  validateCreateRequest,
  authenticateToken,
};
