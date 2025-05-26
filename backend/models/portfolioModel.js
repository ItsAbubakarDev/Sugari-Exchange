const mongoose = require('mongoose');

const assetSchema = mongoose.Schema({
    exchange:{
        type: String,
        required: true,
    },
  coinId: {
    type: String,
    required: true,
  },
  price : {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
}, { _id: false });

const portfolioSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true, // Optional: ensures one portfolio per user
  },
  assets: {
    type: [assetSchema],
    required: true,
    default: [],
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
