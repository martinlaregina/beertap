const express = require('express');
const app = express();
var compression = require('compression');

// parse requests of content-type - application/json
app.use(express.json());

// Compression GZIP
app.use(compression());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
    res.send('Dispenser POST')
})

app.put('/', (req, res) => {
    res.send('Dispenser PUT')
})

app.get('/', (req, res) => {
    res.send('Dispenser GET')
})

// Validate JSON request
app.use((error, req, res, next) => {
  if (error !== null) {
    return res.status(404).json({
      error: 'invalidJson'
    });
  }
  return next();
});

// Set port, listen for requests
const PORT = 3001;

app.listen(PORT, 'localhost', (err) => {
  if (err) {
    console.log('Error');
  } else {
    console.log('Server running');
  }
});