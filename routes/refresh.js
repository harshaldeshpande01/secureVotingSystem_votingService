const express = require('express');

const { 
	checkRefreshToken 
} = require("../middleware/checkRefresh");

const { refreshTokens } = require('../controllers/refresh.js');

const router = express.Router();

router.post('/', checkRefreshToken , refreshTokens);

module.exports = router;