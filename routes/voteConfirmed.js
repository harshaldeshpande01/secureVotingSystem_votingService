const express = require('express');

const { 
	authorizeRequest
} = require("../middleware/authorize");

const { voteConfirmed } = require('../controllers/voteConfirmed.js');

const router = express.Router();

router.post('/', authorizeRequest, voteConfirmed);

module.exports = router;