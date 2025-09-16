const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Tạo JWT token cho user
 * @param {Object} user - object chứa userid và role
 * @returns {string} token
 */
const generateToken = (user) => {
  return jwt.sign(
    { userid: user.userid, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // tuỳ bạn muốn token sống bao lâu
  );
};

module.exports = generateToken;
