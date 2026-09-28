// Controlador de categorias
const Categoria = require('../models/Categoria');
const Programa = require('../models/Programa');

// GET /categorias
async function listar(req, res) {
  try {
    const categorias = await Categoria.find().sort({ nombre: 1 });
    res.json({ ok: true, datos: categorias });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar categorias' });
  }
}

// POST /categorias
async function crear(req, res) {
  try {
    const categoria = await Categoria.create(req.body);
    res.status(201).json({ ok: true, mensaje: 'Categoria creada', datos: categoria });
  } catch (error) {
    // 11000 = nombre repetido
    if (error.code === 11000) {
      return res.status(400).json({ ok: false, mensaje: 'Esa categoria ya existe' });
    }
    res.status(500).json({ ok: false, mensaje: 'Error al crear categoria' });
  }
}

// PUT /categorias/:id
async function actualizar(req, res) {
  try {
    const categoria = await Categoria.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categoria) return res.status(404).json({ ok: false, mensaje: 'Categoria no encontrada' });
    res.json({ ok: true, mensaje: 'Categoria actualizada', datos: categoria });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar categoria' });
  }
}

// DELETE /categorias/:id
async function eliminar(req, res) {
  try {
    // no dejamos borrar una categoria si tiene programas
    const usada = await Programa.findOne({ categoria: req.params.id });
    if (usada) {
      return res.status(400).json({ ok: false, mensaje: 'No se puede borrar: tiene programas asignados' });
    }
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ ok: false, mensaje: 'Categoria no encontrada' });
    res.json({ ok: true, mensaje: 'Categoria eliminada' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar categoria' });
  }
}

module.exports = { listar, crear, actualizar, eliminar };
