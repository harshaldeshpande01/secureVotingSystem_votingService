require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const electionRoutes = require('./routes/election.js');

const app = express();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.get('/', (_req, res) => {
    res.send('Hello')
})

app.use('/api/elections', electionRoutes);

const CONNECTION_URL = 'mongodb://Admin:3Sg3RLt8G1wdmTT6@cluster0-shard-00-00.l9h47.mongodb.net:27017,cluster0-shard-00-01.l9h47.mongodb.net:27017,cluster0-shard-00-02.l9h47.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));