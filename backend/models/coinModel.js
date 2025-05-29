const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  coinId: { type: String, required: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  category: { type: String, required: true },
  current_price: { type: Number, required: true },
  change: { type: Number, required: true },
});

// This will use the default connection
module.exports = mongoose.model("Coin", coinSchema);
