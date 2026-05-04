import jwt from "jsonwebtoken";
import GameService from "../services/Game.Service.js";
import GameEngine from "../Game.Engine.js";
import AuthService from "../services/Auth.Service.js";

export default class SocketManager {
  static init(io) {
    io.use((socket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.replace("Bearer ", "");

        if (!token) {
          throw new Error("No token");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.userId = decoded.id;
        next();
      } catch {
        next(new Error("Unauthorized"));
      }
    });

    io.on("connection", (socket) => {
      const userId = socket.userId;
      socket.join(String(userId));

      const sendJoined = async () => {
        try {
          const user = await AuthService.profile(userId);

          socket.emit("joined", {
            user,
            game: GameEngine.getPublicState(),
          });
          socket.emit("game_state", GameEngine.getPublicState());
        } catch (err) {
          socket.emit("error", err.message);
          socket.disconnect();
        }
      };

      sendJoined();

      socket.on("join_room", sendJoined);

      socket.on("place_bet", async ({ amount }) => {
        try {
          if (GameEngine.gameState !== "FLYING" || !GameEngine.currentRound) {
            throw new Error("Betting is closed");
          }

          const { bet, user } = await GameService.placeBet(
            userId,
            GameEngine.currentRound._id,
            Number(amount),
          );

          socket.emit("bet_placed", {
            bet: {
              id: bet._id,
              amount: bet.amount,
              roundId: bet.roundId,
              status: bet.status,
            },
            balance: user.balance,
          });
          socket.emit("wallet_updated", {
            balance: user.balance,
          });
        } catch (err) {
          socket.emit("error", err.message);
        }
      });

      socket.on("cash_out", async () => {
        try {
          if (GameEngine.gameState !== "FLYING" || !GameEngine.currentRound) {
            throw new Error("Cash out is closed");
          }

          const result = await GameService.cashOut(
            userId,
            GameEngine.currentRound._id,
            GameEngine.multiplier,
          );

          if (!result) {
            throw new Error("No active bet");
          }

          const { bet, user } = result;
          socket.emit("bet_result", {
            amount: bet.amount,
            profit: bet.profit,
            multiplier: bet.cashoutMultiplier,
            balance: user.balance,
          });
          socket.emit("wallet_updated", {
            balance: user.balance,
          });
        } catch (err) {
          socket.emit("error", err.message);
        }
      });
    });
  }
}
