import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/Auth.Routes.js";
import walletRoutes from "./routes/Wallet.Routes.js";
import SocketManager from "./sockets/SocketManager.js";
import GameEngine from "./Game.Engine.js";

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

SocketManager.init(io);
GameEngine.start(io);

server.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
