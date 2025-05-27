const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateToken');
const { 
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
  displayPortfolio 
} = require('../controllers/portfolioController');

router.post('/updatePortfolio', validateToken, updatePortfolio);
router.post('/createPortfolio', validateToken, createPortfolio);
router.delete('/deletePortfolio', validateToken, deletePortfolio);
router.get('/displayPortfolio', validateToken, displayPortfolio);

module.exports = router;
