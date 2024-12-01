const express = require('express');
const app = express();

app.set('view-engine');
app.use(express.urlencoded({ extended: false }));   // to parse URL-encoded bodies sent from html forms
app.use(express.json());    // to parse JSON bodies sent from client

app.use('/js', express.static(__dirname + '/public/js/'));
app.use('/css', express.static(__dirname + '/public/css/'));
app.use('/img', express.static(__dirname + '/public/img/'));
app.use('/src', express.static(__dirname + '/src/'));
const calc = require('./src/routing/calc');
try {
    app.get('/', (req, res) => calc.homeScreen(req, res));
    app.get('/fuel-cost', (req, res) => calc.fuelCostScreen(req, res));
    app.listen(9000);
} catch (error) {
    console.error(error);
}