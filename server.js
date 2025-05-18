const express = require('express');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

app.set('view-engine', 'ejs');

app.use(express.urlencoded({ extended: false }));   // to parse URL-encoded bodies sent from html forms
app.use(express.json());    // to parse JSON bodies sent from client

app.use('/js', express.static(__dirname + '/public/js/'));
app.use('/css', express.static(__dirname + '/public/css/'));
app.use('/img', express.static(__dirname + '/public/img/'));
app.use('/src', express.static(__dirname + '/src/'));
const calc = require('./src/routing/calc');

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

try {
    app.get('/', (req, res) => calc.fuelCostScreen(req, res));
    app.get('/fuel-cost', (req, res) => calc.fuelCostScreen(req, res));
} catch (error) {
    console.error(error);
}

app.listen(PORT, () => {
    console.log('Server running');
});