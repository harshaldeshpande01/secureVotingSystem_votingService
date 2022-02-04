require('dotenv').config({ path: ".env.local" });

const express = require('express');
const hpp = require('hpp');
const cors = require('cors')
const helmet = require('helmet');
const compression = require('compression'); 
const createError = require('http-errors');
const mongoose = require('mongoose');

const electionRoutes = require('./routes/election.js');
const registerRoutes = require('./routes/register.js');
const votingPhaseRoutes = require('./routes/votingPhase.js');
const endElectionRoutes = require('./routes/endElection.js');
const voteConfirmedRoutes = require('./routes/voteConfirmed.js');

const app = express();

// Middleware
// Parse request
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));
app.use(hpp());

// Set headers and gzip response
app.use(compression());
app.use(cors());
app.use(helmet());

app.use('/api/elections', electionRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/startVotingPhase', votingPhaseRoutes);
app.use('/api/endElection', endElectionRoutes);
app.use('/api/voteConfirmed', voteConfirmedRoutes);

// catch 404 and forward to error handler
// note this is after all good routes and is not an error handler
// to get a 404, it has to fall through to this route - no error involved
app.use(function(req, res, next) {
  var err = new Error('Page not Found');
  err.status = 404;
  next(err);
});

// error handlers - these take err object.
// these are per request error handlers.  They have two so in dev
// you get a full stack trace.  In prod, first is never setup

// development error handler
// will print stacktrace
if (process.env.NODE_ENV === 'development') {
  app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
          message: err.message,
          error: err
      });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
      message: err.message,
      error: {}
  });
});

const CONNECTION_URL = process.env.DATABASE_URL
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT))
  .catch((error) => console.log(`${error} did not connect`));