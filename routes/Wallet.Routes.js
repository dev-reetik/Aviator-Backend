import express from "express";
import WalletController from "../controllers/Wallet.Controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, WalletController.getWallet);
router.post("/deposit", auth, WalletController.deposit);
router.post("/withdraw", auth, WalletController.withdraw);

export default router;
