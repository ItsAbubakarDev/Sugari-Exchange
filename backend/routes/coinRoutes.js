const express = require('express');
const router = express.Router();
const { getCoins } = require('../controllers/coinController');

router.get('/getCoins', getCoins);

module.exports = router;
