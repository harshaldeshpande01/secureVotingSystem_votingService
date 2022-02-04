const express = require('express');

const { 
	authorizeRequest
} = require("../middleware/authorize");

const { setAlreadyVoted } = require('../controllers/setAlreadyVoted.js');

const router = express.Router();

router.post('/:id', authorizeRequest, setAlreadyVoted);

module.exports = router;