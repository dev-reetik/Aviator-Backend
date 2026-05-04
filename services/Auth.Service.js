import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.Model.js";

export default class AuthService {
  static serializeUser(user) {
    return {
      id: user._id,
      username: user.username,
      balance: user.balance,
    };
  }

  static async register(username, password) {
    try {
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ username, password: hash });
      return this.serializeUser(user);
    } catch (error) {
      throw error;
    }
  }

  static async login(username, password) {
    try {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      return {
        token,
        user: this.serializeUser(user),
      };
    } catch (error) {
      throw error;
    }
  }

  static async profile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      return this.serializeUser(user);
    } catch (error) {
      throw error;
    }
  }
}
