// Controlador de personajes (con su actor)
const Personaje = require('../models/Personaje');

// GET /personajes?programa=ID
async function listar(req, res) {
  try {
    const filtro = {};
    if (req.query.programa) filtro.programa = req.query.programa;
    const personajes = await Personaje.find(filtro).populate('programa', 'titulo');
    res.json({ ok: true, datos: personajes });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar personajes' });
  }
}

// POST /personajes
async function crear(req, res) {
  try {
    const personaje = await Personaje.create(req.body);
    res.status(201).json({ ok: true, mensaje: 'Personaje creado', datos: personaje });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear personaje' });
  }
}

// PUT /personajes/:id
async function actualizar(req, res) {
  try {
    const personaje = await Personaje.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!personaje) return res.status(404).json({ ok: false, mensaje: 'Personaje no encontrado' });
    res.json({ ok: true, mensaje: 'Personaje actualizado', datos: personaje });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar personaje' });
  }
}

// DELETE /personajes/:id
async function eliminar(req, res) {
  try {
    const personaje = await Personaje.findByIdAndDelete(req.params.id);
    if (!personaje) return res.status(404).json({ ok: false, mensaje: 'Personaje no encontrado' });
    res.json({ ok: true, mensaje: 'Personaje eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar personaje' });
  }
}

module.exports = { listar, crear, actualizar, eliminar };
