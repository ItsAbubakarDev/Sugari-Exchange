const mongoose = require("mongoose");

const executeTrade = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.id;
    const { exchange, coinId, price, amount, action } = req.body;

    if (!userId || !exchange || !coinId || !price || !amount || !action) {
      throw new Error("Missing required fields");
    }

    const portfolio = await Portfolio.findOne({ user_id: userId }).session(session);
    if (!portfolio) throw new Error("Portfolio not found");

    const assetIndex = portfolio.assets.findIndex(
      a => a.exchange === exchange && a.coinId === coinId
    );

    if (action === "sell") {
      if (assetIndex < 0 || portfolio.assets[assetIndex].amount < amount) {
        throw new Error("Insufficient balance to sell");
      }
      portfolio.assets[assetIndex].amount -= amount;
      if (portfolio.assets[assetIndex].amount === 0) {
        portfolio.assets.splice(assetIndex, 1);
      }
    } else {
      if (assetIndex >= 0) {
        portfolio.assets[assetIndex].amount += amount;
        portfolio.assets[assetIndex].price = price;
      } else {
        portfolio.assets.push({ exchange, coinId, price, amount });
      }
    }

    await portfolio.save({ session });

    const newTrade = await Trade.create(
      [{
        user_id: userId,
        exchange,
        coinId,
        price,
        amount,
        action,
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ trade: newTrade[0], portfolio });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: error.message });
  }
});
