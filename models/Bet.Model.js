import mongoose from "mongoose";

const betSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  roundId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  cashoutMultiplier: Number,
  profit: Number,
  status: {
    type: String,
    enum: ["PLACED", "CASHED_OUT", "LOST"],
    default: "PLACED"
  }
});

export default mongoose.model("Bet", betSchema);