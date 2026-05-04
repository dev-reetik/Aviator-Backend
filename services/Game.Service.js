import Bet from "../models/Bet.Model.js";
import User from "../models/User.Model.js";

export default class GameService {
  static async placeBet(userId, roundId, amount) {
    if (!userId) throw new Error("Unauthorized");
    if (!roundId) throw new Error("Round not active");
    const betAmount = Number(amount.toFixed(2));

    if (!Number.isFinite(betAmount) || betAmount <= 0) {
      throw new Error("Invalid bet amount");
    }

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (user.balance < betAmount) {
      throw new Error("Insufficient balance");
    }

    const existingBet = await Bet.findOne({
      userId,
      roundId,
      status: "PLACED",
    });

    if (existingBet) {
      throw new Error("You already have an active bet");
    }

    user.balance = Number((user.balance - betAmount).toFixed(2));
    await user.save();

    const bet = await Bet.create({
      userId,
      roundId,
      amount: betAmount,
    });

    return { bet, user };
  }

  static async cashOut(userId, roundId, multiplier) {
    if (!userId) throw new Error("Unauthorized");
    if (!roundId) throw new Error("Round not active");

    const bet = await Bet.findOne({
      userId,
      roundId,
      status: "PLACED",
    });

    if (!bet) return null;

    bet.status = "CASHED_OUT";
    const cashoutMultiplier = Number(multiplier.toFixed(2));

    bet.cashoutMultiplier = cashoutMultiplier;
    bet.profit = Number((bet.amount * cashoutMultiplier).toFixed(2));

    await bet.save();

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    user.balance = Number((user.balance + bet.profit).toFixed(2));
    await user.save();

    return { bet, user };
  }

  static async resolveBets(roundId) {
    const bets = await Bet.find({ roundId });

    const lostBets = [];

    for (const bet of bets) {
      if (bet.status === "PLACED") {
        bet.status = "LOST";
        await bet.save();
        lostBets.push(bet);
      }
    }

    return lostBets;
  }
}
