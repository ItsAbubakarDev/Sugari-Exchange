const asyncHandler = require('express-async-handler');
const Portfolio = require("../models/portfolioModel");

// @desc Create portfolio with initial USDT balance
// @route POST /api/portfolio/create
// @access Private
const createPortfolio = asyncHandler(async (req, res) => {
    const userId = req.user.id; // pulled from token by validateToken middleware

    if (!userId) {
        res.status(400);
        throw new Error("User is not authenticated");
    }

    // Check if portfolio already exists for this user
    const existing = await Portfolio.findOne({ user_id: userId });
    if (existing) {
        res.status(400);
        throw new Error("Portfolio already exists for this user");
    }

    const newPortfolio = await Portfolio.create({
        user_id: userId,
        assets: [
            {
                exchange: "binance", // Or let the user choose in the frontend
                coinId: "USDT",
                price: 1,
                amount: 500,
            },
        ],
    });

    res.status(201).json(newPortfolio);
});

const asyncHandler = require('express-async-handler');
const Portfolio = require('../models/portfolioModel');

// @desc Update portfolio with buy or sell asset
// @route POST /api/portfolio/updatePortfolio
// @access Private
const updatePortfolio = asyncHandler(async (req, res) => {
    const userId = req.user.id; // from token

    if (!userId) {
        res.status(401);
        throw new Error("User is not authenticated");
    }

    const { exchange, coinId, price, amount, action } = req.body;

    if (!exchange || !coinId || !price || !amount || !action) {
        res.status(400);
        throw new Error("All fields (exchange, coinId, price, amount, action) are mandatory");
    }

    // Find portfolio of user
    const portfolio = await Portfolio.findOne({ user_id: userId });

    if (!portfolio) {
        res.status(404);
        throw new Error("Portfolio not found for this user");
    }

    // Find if asset already exists in portfolio
    const assetIndex = portfolio.assets.findIndex(asset => asset.coinId === coinId && asset.exchange === exchange);

    if (action === "buy") {
        if (assetIndex >= 0) {
            // Update existing asset amount and price (average price can be calculated if needed)
            portfolio.assets[assetIndex].amount += amount;
            portfolio.assets[assetIndex].price = price; // or recalc weighted avg price
        } else {
            // Add new asset entry
            portfolio.assets.push({ exchange, coinId, price, amount });
        }
    } else if (action === "sell") {
        if (assetIndex < 0) {
            res.status(400);
            throw new Error(`You do not own any ${coinId} on ${exchange}`);
        }
        if (portfolio.assets[assetIndex].amount < amount) {
            res.status(400);
            throw new Error(`Insufficient amount to sell. You own ${portfolio.assets[assetIndex].amount}`);
        }

        portfolio.assets[assetIndex].amount -= amount;

        // Remove asset if amount becomes zero
        if (portfolio.assets[assetIndex].amount === 0) {
            portfolio.assets.splice(assetIndex, 1);
        }
    } else {
        res.status(400);
        throw new Error("Invalid action. Use 'buy' or 'sell'");
    }

    await portfolio.save();

    res.status(200).json(portfolio);
});

// @desc Delete Portfolio
// @route POST /api/portfolio/deletePortfolio
// @access Private
const deletePortfolio = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        res.status(401);
        throw new Error("User is not authenticated");
    }

    const portfolio = await Portfolio.findOne({ user_id: userId });

    if (!portfolio) {
        res.status(404);
        throw new Error("Portfolio not found for this user");
    }

    await portfolio.deleteOne();

    res.status(200).json({ message: "Portfolio deleted successfully", portfolio });
});

module.exports = { createPortfolio ,updatePortfolio ,deletePortfolio};
