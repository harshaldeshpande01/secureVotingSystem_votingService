require('dotenv').config();

const express = require('express');
const hpp = require('hpp');
const cors = require('cors')
const helmet = require('helmet');
const compression = require('compression'); 
const createError = require('http-errors');
const mongoose = require('mongoose');

const electionRoutes = require('./routes/election.js');
// const refreshRoute = require('./routes/refresh.js');

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
// app.use('/api/refresh', refreshRoute);

// Handle 404's
app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  })
})

const CONNECTION_URL = process.env.DATABASE_URL
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT))
  .catch((error) => console.log(`${error} did not connect`));