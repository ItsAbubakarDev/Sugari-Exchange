const asyncHandler = require('express-async-handler');
const Coin = require("../models/coinModel");

// @desc    Get all coins
// @route   GET /api/coins/getCoins
// @access  Public
const getCoins = asyncHandler(async (req, res) => {
    try {
        console.log('Fetching coins...');
        const coins = await Coin.find().limit(100);
        res.status(200).json(coins);
    } catch (err) {
        console.error('Error fetching coins:', err);
        res.status(500).json({ 
            message: 'Error fetching coins', 
            error: err.message 
        });
    }
});

module.exports = { getCoins };
