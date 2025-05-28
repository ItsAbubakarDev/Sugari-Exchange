const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Trade = require("../models/tradeModel");
// @desc Get trade history
// @route GET /api/tradeHistory/getTradeHistory
// @access Private 
const getTradeHistory = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 10, coinId, action, exchange } = req.query;

    if (!userId) {
        res.status(400);
        throw new Error("User is not authenticated");
    }

    // Build filter object
    const filter = { user_id: userId };
    
    if (coinId) filter.coinId = coinId;
    if (action) filter.action = action.toLowerCase();
    if (exchange) filter.exchange = exchange;


    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    try {
        const trades = await TradeHistory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user_id', 'username email'); // Optional: populate user details

        const total = await TradeHistory.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: trades,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500);
        throw new Error("Failed to fetch trade history");
    }
});

module.exports = { getTradeHistory };
