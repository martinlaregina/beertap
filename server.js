const express = require('express');
var compression = require('compression');
const app = express();

// parse requests of content-type - application/json
app.use(express.json());

// Compression GZIP
app.use(compression());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Validate JSON request
app.use((error, req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '1800');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, PATCH, OPTIONS'
  );
  next();
});

// API Routes
app.use('/', require('./routes/dispenser.routes'));

app.listen(3001, 'localhost', (err) => {
  if (err) {
    console.log('Error');
  } else {
    console.log('Server running');
  }
});