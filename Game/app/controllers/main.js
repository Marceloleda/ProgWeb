function index(req, res) {
    res.render("main/index", {
        titulo: "T-Rex"
    });
}

function sobre(req, res) {
    res.render("main/about", {
        titulo: "Sobre o T-Rex"
    });
}

function game(req, res) {
    res.render("main/game", {
        titulo: "T-Rex"
    });
}

function interface(req, res) {
    res.render("main/interface", {});
}

module.exports = { index, sobre, game, interface };
