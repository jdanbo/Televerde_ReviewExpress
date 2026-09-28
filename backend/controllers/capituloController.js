// Controlador de capitulos
const Capitulo = require('../models/Capitulo');

// GET /capitulos?programa=ID
async function listar(req, res) {
  try {
    const filtro = {};
    if (req.query.programa) filtro.programa = req.query.programa;
    const capitulos = await Capitulo.find(filtro).populate('programa', 'titulo').sort({ numero: 1 });
    res.json({ ok: true, datos: capitulos });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar capitulos' });
  }
}

// POST /capitulos
async function crear(req, res) {
  try {
    const capitulo = await Capitulo.create(req.body);
    res.status(201).json({ ok: true, mensaje: 'Capitulo creado', datos: capitulo });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear capitulo' });
  }
}

// PUT /capitulos/:id
async function actualizar(req, res) {
  try {
    const capitulo = await Capitulo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!capitulo) return res.status(404).json({ ok: false, mensaje: 'Capitulo no encontrado' });
    res.json({ ok: true, mensaje: 'Capitulo actualizado', datos: capitulo });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar capitulo' });
  }
}

// DELETE /capitulos/:id
async function eliminar(req, res) {
  try {
    const capitulo = await Capitulo.findByIdAndDelete(req.params.id);
    if (!capitulo) return res.status(404).json({ ok: false, mensaje: 'Capitulo no encontrado' });
    res.json({ ok: true, mensaje: 'Capitulo eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar capitulo' });
  }
}

module.exports = { listar, crear, actualizar, eliminar };
