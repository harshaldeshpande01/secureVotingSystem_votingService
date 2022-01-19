const express = require('express');

const { 
	authorizeRequest
} = require("../middleware/authorize");

const { endElection } = require('../controllers/election.js');
const res = require('express/lib/response');

const router = express.Router();

router.post('/:id', authorizeRequest, endElection);

module.exports = router;