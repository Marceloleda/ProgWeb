const models = require("../models/index");
const Area = models.Area;

async function index(req, res) {
    try {
        const areas = await Area.findAll();
        areas.forEach(area => console.log(area));
        res.render("area/index", {
            areas: areas.map(area => area.toJSON())
        });
    } catch (error) {
        console.error("Erro:", error);
    }
}

module.exports = { index };
