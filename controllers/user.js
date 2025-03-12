const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const { generateAccessToken } = require("../utils/customFunction");
const { Resend } = require("resend");
const crypto = require("crypto");

const validateRegister = async (req, res, next) => {
  const { username, email } = req.body;

  try {
    if (!email || !username) {
      return res.status(400).json({ message: "Email and username are required" });
    }

    // Check if email already exists
    const findEmail = await prisma.user.findUnique({ where: { email } });
    if (findEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if username already exists
    const findUser = await prisma.user.findUnique({ where: { username } });
    if (findUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate unique OTP
    let otp;
    let otpExists = true;
    while (otpExists) {
      otp = crypto.randomBytes(6)
        .map((byte) => byte % 10)
        .join("")
        .slice(0, 6);

      otpExists = await prisma.verifyToken.findFirst({ where: { token: otp } });
    }

    // Store OTP with 10-minute expiration
    await prisma.verifyToken.create({
      data: {
        token: otp,
        email: email,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 10 minutes
      },
    });

    // Send email via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Your Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">Your Verification Code</h2>
          <p style="font-size: 16px; color: #555;">Use the following code to proceed:</p>
          <p style="font-size: 28px; font-weight: bold; color: #000; letter-spacing: 4px; text-align: center;">${otp}</p>
          <p style="font-size: 14px; color: #777;">This code is valid for the next 10 minutes. If you didn’t request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Thanks,<br/>PathAlert Team</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP code sent successfully." });

  } catch (err) {
    console.error("Error in validateRegister:", err);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};

const register = async (req, res, next) => {
  const { fullname, username, password, email, code } = req.body;
  try {
    const findCode = await prisma.verifyToken.findFirst({
      where: {
        token: code
      }
    })
    if(!findCode){
      res.status(400).json({
        message: "Code doesn't exist"
      })
    }
    if (Date.now() > findCode.expiresAt) {
      return res.status(400).json({
        message: "Code has expired",
      });
    }
    const findEmail = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (findEmail) {
      res.status(400).json({
        message: "Email already exists",
      });
    }
    const findUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    console.log(findUser);
    if (findUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: fullname,
        username: username,
        email: email,
        password: hashedPassword,
        role: "user",
      },
    });

    const accessToken = generateAccessToken(user);

    await prisma.accessToken.create({
      data: {
        userId: user.id,
        tokenHash: accessToken,
      },
    });

    return res.status(200).json({
      message: "User created successfully",
      user: user,
      accessToken: accessToken,
    });
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!findUser) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, findUser.password);
    if (isPasswordValid) {
      const accessToken = generateAccessToken(findUser);
      const existingSession = prisma.accessToken.findFirst({
        data: {
          userId: findUser.id,
        },
      });
      if (existingSession) {
        await prisma.accessToken.deleteMany({
          where: {
            userId: findUser.id,
          },
        });
      }
      await prisma.accessToken.create({
        data: {
          userId: findUser.id,
          tokenHash: accessToken,
        },
      });

      req.user = findUser;

      return res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: findUser.id,
          name: findUser.name,
          username: findUser.username,
          email: findUser.email,
          role: findUser.role,
          profileImg: findUser.profileImg,
        },
        accessToken: accessToken,
      });
    } else {
      return res.status(400).json({
        message: "Username or password is incorrect",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await prisma.accessToken.deleteMany({
      where: {
        userId: req.user.id,
        tokenHash: req.accessToken,
      },
    });
    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const sendResetPasswordCode = async (req, res, next) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }

    let otp;
    let otpExists = true;
    while (otpExists) {
      const buffer = crypto.randomBytes(6);
      otp = Array.from(buffer)
        .map((byte) => byte % 10)
        .join("")
        .slice(0, 6);

      otpExists = await prisma.resetToken.findFirst({
        where: { token: otp },
      });
    }

    await prisma.resetToken.create({
      data: {
        token: otp,
        userId: user.id,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 minutes
      },
    });

    resend.emails.send({
      from: "onboarding@resend.dev",
      to: "lagmanmarquez@gmail.com",
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #333;">Your OTP Code</h2>
          <p style="font-size: 16px; color: #555;">Use the following OTP code to proceed:</p>
          <p style="font-size: 28px; font-weight: bold; color: #000; letter-spacing: 4px; text-align: center;">${otp}</p>
          <p style="font-size: 14px; color: #777;">This code is valid for the next 10 minutes. If you didn’t request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Thanks,<br/>PathAlert Team</p>
        </div>
      `,
    });

    // sendEmail(req.body.email, { code: otp }, "PathAlertPasswordReset");

    res.status(200).json({ message: "OTP code sent successfully." });
  } catch (err) {
    console.log(err);
  }
};

const resetPassword = async (req, res, next) => {
  const { code, password } = req.body;
  const otp = String(code);
  console.log(otp);
  try {
    const resetToken = await prisma.resetToken.findFirst({
      where: {
        token: otp,
      },
    });
    console.log(resetToken);
    if (!resetToken) {
      return res.status(400).json({
        message: "Code is invalid or has expired",
      });
    }
    if (Date.now() > resetToken.expiresAt) {
      return res.status(400).json({
        message: "Code has expired",
      });
    }
    const user = await prisma.user.findFirst({
      where: {
        id: resetToken.userId,
      },
    });
    const same = await bcrypt.compare(password, user.password);
    if (same) {
      return res.status(400).json({
        message: "Password is the same as before",
      });
    }
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });
    await prisma.resetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });
    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  sendResetPasswordCode,
  resetPassword,
  validateRegister,
};
