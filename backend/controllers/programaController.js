// Controlador de programas
const Programa = require('../models/Programa');
const Capitulo = require('../models/Capitulo');
const Personaje = require('../models/Personaje');

// GET /programas   (se puede filtrar: /programas?categoria=ID&buscar=texto)
async function listar(req, res) {
  try {
    const filtro = {};
    if (req.query.categoria) filtro.categoria = req.query.categoria;
    if (req.query.buscar) filtro.titulo = { $regex: req.query.buscar, $options: 'i' };

    const programas = await Programa.find(filtro)
      .populate('categoria', 'nombre color') // trae el nombre de la categoria
      .sort({ createdAt: -1 });

    res.json({ ok: true, datos: programas });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al listar programas' });
  }
}

// GET /programas/:id   (trae el programa con sus capitulos y personajes)
async function obtenerUno(req, res) {
  try {
    const programa = await Programa.findById(req.params.id).populate('categoria', 'nombre color');
    if (!programa) return res.status(404).json({ ok: false, mensaje: 'Programa no encontrado' });

    const capitulos = await Capitulo.find({ programa: programa._id }).sort({ numero: 1 });
    const personajes = await Personaje.find({ programa: programa._id });

    res.json({ ok: true, datos: { programa, capitulos, personajes } });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al obtener programa' });
  }
}

// POST /programas
async function crear(req, res) {
  try {
    const programa = await Programa.create(req.body);
    res.status(201).json({ ok: true, mensaje: 'Programa creado', datos: programa });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al crear programa' });
  }
}

// PUT /programas/:id
async function actualizar(req, res) {
  try {
    const programa = await Programa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!programa) return res.status(404).json({ ok: false, mensaje: 'Programa no encontrado' });
    res.json({ ok: true, mensaje: 'Programa actualizado', datos: programa });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar programa' });
  }
}

// DELETE /programas/:id   (tambien borra sus capitulos y personajes)
async function eliminar(req, res) {
  try {
    const programa = await Programa.findByIdAndDelete(req.params.id);
    if (!programa) return res.status(404).json({ ok: false, mensaje: 'Programa no encontrado' });

    await Capitulo.deleteMany({ programa: req.params.id });
    await Personaje.deleteMany({ programa: req.params.id });

    res.json({ ok: true, mensaje: 'Programa eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al eliminar programa' });
  }
}

module.exports = { listar, obtenerUno, crear, actualizar, eliminar };
