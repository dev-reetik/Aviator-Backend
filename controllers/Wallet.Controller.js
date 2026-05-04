import WalletService from "../services/Wallet.Service.js";

export default class WalletController {
  static async getWallet(req, res) {
    try {
      const user = await WalletService.getWallet(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deposit(req, res) {
    try {
      const user = await WalletService.deposit(
        req.user.id,
        Number(req.body.amount),
      );
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async withdraw(req, res) {
    try {
      const user = await WalletService.withdraw(
        req.user.id,
        Number(req.body.amount),
      );
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
