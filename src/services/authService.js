const bcrypt = require("bcrypt");
const userRepository = require("@repositories/userRepository");
const generateToken = require("@utils/generateToken");

class AuthService {
  async register({ name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.createUser({
      name,
      email,
      password: hashed,
    });

    return {
      userid: user.userid,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user),
    };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      userid: user.userid,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user),
    };
  }
}

module.exports = new AuthService();
