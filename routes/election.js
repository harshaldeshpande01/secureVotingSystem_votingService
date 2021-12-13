const express = require('express');

const { 
	authorizeRequest 
} = require("../middleware/authorize");

const { getAllElections, getElections, getElectionsBySearch, getElection, createElection } = require('../controllers/election.js');

const router = express.Router();

router.get('/search', authorizeRequest, getElectionsBySearch);
router.get('/', authorizeRequest , getElections);
router.get('/all', authorizeRequest , getAllElections);
router.get('/:id', authorizeRequest , getElection);
router.post('/', authorizeRequest , createElection);

module.exports = router;