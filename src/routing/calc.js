function homeScreen(req, res) {
    res.render('home.ejs');
}

function fuelCostScreen(req, res) {
    res.render('fuel-cost.ejs');
}

module.exports = {
    homeScreen, fuelCostScreen
}