const express = require('express');

const { getAllElections, getElections, getElectionsBySearch, getElection, createElection } = require('../controllers/election.js');

const router = express.Router();

router.get('/search', getElectionsBySearch);
router.get('/', getElections);
router.get('/all', getAllElections);
router.get('/:id', getElection);
router.post('/', createElection);

module.exports = router;