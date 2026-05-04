import User from "../models/User.Model.js";
import AuthService from "./Auth.Service.js";

export default class WalletService {
  static async getWallet(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      return AuthService.serializeUser(user);
    } catch (error) {
      throw error;
    }
  }

  static async deposit(userId, amount) {
    try {
      const walletAmount = Number(amount.toFixed(2));

      if (!Number.isFinite(walletAmount) || walletAmount <= 0) {
        throw new Error("Invalid deposit amount");
      }

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      user.balance = Number((user.balance + walletAmount).toFixed(2));
      await user.save();

      return AuthService.serializeUser(user);
    } catch (error) {
      throw error;
    }
  }

  static async withdraw(userId, amount) {
    try {
      const walletAmount = Number(amount.toFixed(2));

      if (!Number.isFinite(walletAmount) || walletAmount <= 0) {
        throw new Error("Invalid withdraw amount");
      }

      const user = await User.findById(userId);
      if (!user) throw new Error("User not found");

      if (user.balance < walletAmount) {
        throw new Error("Insufficient balance");
      }

      user.balance = Number((user.balance - walletAmount).toFixed(2));
      await user.save();

      return AuthService.serializeUser(user);
    } catch (error) {
      throw error;
    }
  }
}
