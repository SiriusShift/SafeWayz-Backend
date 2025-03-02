const CryptoJS = require("crypto-js");
const { saltkey } = require("./saltkey");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const decryptString = (data) => {
  if (!data) return null;
  console.log(data);
  const bytes = CryptoJS.AES.decrypt(data, saltkey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};

const encryptString = (data) => {
  if (!data) return null;
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    saltkey
  ).toString();
  return ciphertext;
};

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET
  );
};

module.exports = {
  decryptString,
  encryptString,
  generateAccessToken,
};
