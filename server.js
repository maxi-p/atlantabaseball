require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require('./src/routes/v1');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URL, {
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
app.set('port', PORT);

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/v1', routes);

// Set static folder
app.use(express.static('frontend/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log('Server listening on port ' + PORT);
});
