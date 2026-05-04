import Round from "./models/Round.Model.js";
import CrashService from "./services/Crash.Service.js";
import GameService from "./services/Game.Service.js";

export default class GameEngine {
  static gameState = "WAITING";
  static multiplier = 1;
  static currentRound = null;
  static crashPoint = 0;
  static history = [];
  static intervalId = null;
  static nextRoundAt = Date.now() + 3000;
  static ticking = false;

  static getPublicState() {
    return {
      gameState: this.gameState,
      multiplier: Number(this.multiplier.toFixed(2)),
      roundId: this.currentRound?._id || null,
      crashAt: this.gameState === "CRASHED" ? this.crashPoint : null,
      waitMs:
        this.gameState === "WAITING"
          ? Math.max(0, this.nextRoundAt - Date.now())
          : 0,
      history: this.history,
    };
  }

  static emitState(io) {
    io.emit("game_state", this.getPublicState());
  }

  static setWaiting(io, waitMs = 5000) {
    this.gameState = "WAITING";
    this.multiplier = 1;
    this.currentRound = null;
    this.nextRoundAt = Date.now() + waitMs;

    io.emit("round_waiting", this.getPublicState());
  }

  static async startRound(io) {
    try {
      const serverSeed = Math.random().toString(36);
      const { crashPoint, hash } = CrashService.generate(serverSeed);

      this.crashPoint = crashPoint;

      this.currentRound = await Round.create({
        crashPoint,
        serverSeed,
        hash,
      });

      this.multiplier = 1;
      this.gameState = "FLYING";

      io.emit("round_started", {
        ...this.getPublicState(),
        hash,
      });
    } catch (error) {
      throw error;
    }
  }

  static async crashRound(io) {
    try {
      this.gameState = "CRASHED";
      this.multiplier = this.crashPoint;
      this.history = [
        {
          roundId: this.currentRound._id,
          value: this.crashPoint,
        },
        ...this.history,
      ].slice(0, 12);

      io.emit("round_crashed", {
        ...this.getPublicState(),
        crashAt: this.crashPoint,
      });

      const lostBets = await GameService.resolveBets(this.currentRound._id);

      for (const bet of lostBets) {
        io.to(String(bet.userId)).emit("bet_lost", {
          amount: bet.amount,
          roundId: bet.roundId,
        });
      }

      setTimeout(() => {
        this.setWaiting(io, 5000);
      }, 1800);
    } catch (error) {
      throw error;
    }
  }

  static start(io) {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.setWaiting(io, 3000);

    this.intervalId = setInterval(async () => {
      if (this.ticking) return;
      this.ticking = true;

      try {
        if (this.gameState === "WAITING") {
          if (Date.now() >= this.nextRoundAt) {
            await this.startRound(io);
          }
        } else if (this.gameState === "FLYING") {
          this.multiplier += 0.01;

          io.emit("multiplier_tick", {
            value: this.multiplier.toFixed(2),
          });

          if (this.multiplier >= this.crashPoint) {
            await this.crashRound(io);
          }
        }
      } finally {
        this.ticking = false;
      }
    }, 100);
  }
}
