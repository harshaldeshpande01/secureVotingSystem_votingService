const express = require('express');

const { 
	authorizeRequest
} = require("../middleware/authorize");

const { registerVoter } = require('../controllers/election.js');
const res = require('express/lib/response');

const router = express.Router();

router.post('/:id', authorizeRequest, registerVoter);

module.exports = router;