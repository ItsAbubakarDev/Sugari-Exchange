const mongoose = require('mongoose');

const tradeSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    exchange: {
      type: String,
      required: [true, "Exchange is required"],
    },
    coinId: {
      type: String,
      required: [true, "CoinId is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      enum: ["buy", "sell"],
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Trade", tradeSchema);
