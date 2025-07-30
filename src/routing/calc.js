function homeScreen(req, res) {
    res.render('home.ejs');
}

function fuelCostScreen(req, res) {
    res.render('fuel-cost.ejs', { path: 'fuel-cost' });
}

module.exports = {
    homeScreen, fuelCostScreen
}