const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateToken');
const { updatePortfolio } = require('../controllers/portfolioController');

router.post('/updatePortfolio', validateToken, updatePortfolio);
router.post('/createPortfolio', validateToken, createPortfolio);
router.post('/deletePortfolio', validateToken, deletePortfolio);
module.exports = router;
