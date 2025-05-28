const express = require("express");
const router = express.Router();
const validateToken = require("../middlewares/validateToken"); // adjust path if needed
const { executeTrade } = require("../controllers/tradeController");

router.post("/executeTrade", executeTrade);  

module.exports = router;