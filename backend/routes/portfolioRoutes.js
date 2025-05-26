const express = require('express');
const router = express.Router();
const validateToken = require('../middleware/validateToken');
const { createPortfolio,updatePortfolio,deletePortfolio ,displayPortfolio } = require('../controllers/portfolioController');

router.post('/updatePortfolio', validateToken, updatePortfolio);
router.post('/createPortfolio', validateToken, createPortfolio);
router.post('/deletePortfolio', validateToken, deletePortfolio);
router.get('/displayPortfolio' , validateToken, deletePortfolio);
module.exports = router;
