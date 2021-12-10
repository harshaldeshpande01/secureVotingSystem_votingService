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

const CONNECTION_URL = 'mongodb+srv://Admin:harshal@cluster0.l9h47.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const PORT = process.env.PORT|| 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));