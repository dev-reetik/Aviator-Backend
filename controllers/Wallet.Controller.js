import WalletService from "../services/Wallet.Service.js";

export default class WalletController {
  static async getWallet(req, res) {
    try {
      if(!req.user || !req.user.id){
        return res.status(401).json({success:false, message:"User authentication required"})
      }
      const user = await WalletService.getWallet(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deposit(req, res) {
    try {
      if(!req.user || !req.user.id){
        return res.status(401).json({success:false, message:"User authentication required"})
      }
      if(!req.body.amount || isNaN(req.body.amount) || Number(req.body.amount) <= 0){
        return res.status(400).json({success:false, message:"Valid amount is required"})
      }
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
      if(!req.user || !req.user.id){
        return res.status(401).json({success:false, message:"User authentication required"})
      }
      if(!req.body.amount || isNaN(req.body.amount) || Number(req.body.amount) <= 0){
        return res.status(400).json({success:false, message:"Valid amount is required"})
      }
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
