const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt")

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

    await prisma.user.create({
      data: {
        name: fullname,
        username: username,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
    register
}