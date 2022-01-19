const express = require('express');

const { 
	authorizeRequest
} = require("../middleware/authorize");

const { getAllElections, getElections, getElection, createElection, deleteElection } = require('../controllers/election.js');
const res = require('express/lib/response');

const router = express.Router();

router.get('/', authorizeRequest, getElections);
router.get('/all', authorizeRequest, getAllElections);
router.get('/:id', authorizeRequest, getElection);
router.post('/', authorizeRequest, createElection);
router.delete('/:id', authorizeRequest, deleteElection);

module.exports = router;