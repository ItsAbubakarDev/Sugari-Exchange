const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken"); // ✅ only once
const { executeTrade } = require("../controllers/tradeController");

router.post("/executeTrade", validateToken, executeTrade);  

module.exports = router;
