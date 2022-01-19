const express = require('express');

const { 
	authorizeRequest
} = require("../middleware/authorize");

const { startVotingPhase } = require('../controllers/election.js');
const res = require('express/lib/response');

const router = express.Router();

router.post('/:id', authorizeRequest, startVotingPhase);

module.exports = router;