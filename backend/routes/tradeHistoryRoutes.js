const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken"); 
const { getTradeHistory } = require("../controllers/tradeHistoryController");

router.get("/getTradeHistory", validateToken, getTradeHistory);

module.exports = router;