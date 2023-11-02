const models = require("../models/index");
const Curso = models.Curso;

async function index(req, res) {
    const cursos = await Curso.findAll();
    res.render("curso/index", {
        cursos: cursos.map(curso => curso.toJSON())
    });
}

async function create(req, res) {
    try {
        if (req.method === "GET") {
            res.render("curso/create");
        } else {
            const newCurso = {
                sigla: req.body.sigla,
                nome: req.body.nome,
                descricao: req.body.descricao,
                areaId: req.body.areaId,
            };
            await Curso.create(newCurso);
            res.redirect('/');
        }
    } catch (errors) {
        res.render("curso/create", {
            curso: req.body,
            errors: errors
        });
    }
}

async function read(req, res) {
    const curso = await Curso.findOne({
        where: { id: req.params.id },
        include: models.Area
    });
    res.render("curso/read", {
        curso: curso.toJSON()
    });
}

async function update(req, res) {
    try {
        if (req.method === "GET") {
            const curso = await Curso.findOne({ where: { id: req.params.id } });
            res.render("curso/update", {
                curso: curso.toJSON()
            });
        } else {
            const updatedCurso = {
                sigla: req.body.sigla,
                nome: req.body.nome,
                descricao: req.body.descricao,
                areaId: req.body.areaId,
            };
            await Curso.update(updatedCurso, { where: { id: req.params.id } });
            res.redirect('/curso/' + req.params.id);
        }
    } catch (errors) {
        res.render("curso/update", {
            curso: req.body,
            errors: errors
        });
    }
}

async function remove(req, res) {
    const curso = await Curso.findOne({ where: { id: req.params.id } });
    await curso.destroy();
    res.redirect('/curso/');
}

module.exports = { index, create, read, update, remove };
