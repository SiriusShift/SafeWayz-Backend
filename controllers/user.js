const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt")
const { generateAccessToken } = require("../utils/customFunction");

const register = async (req, res, next) => {
  const { fullname, username, password } = req.body;
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    console.log(findUser)
    if (findUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: fullname,
        username: username,
        password: hashedPassword,
        role: "user",
      },
    });

    const accessToken = generateAccessToken(user);

    return res.status(200).json({
      message: "User created successfully",
      user: user,
      accessToken: accessToken
    });
    
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try{
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
      return res.status(200).json({
        message: "User logged in successfully",
        user: findUser,
        accessToken: accessToken
      });
    }
    else{
      return res.status(400).json({
        message: "Username or password is incorrect",
      });
    }
  }catch(err){
    console.log(err)
  }
}

module.exports = {
    register,
    login
}