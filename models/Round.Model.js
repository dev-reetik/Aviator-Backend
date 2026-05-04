import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  crashPoint: Number,
  serverSeed: String,
  hash: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Round", roundSchema);