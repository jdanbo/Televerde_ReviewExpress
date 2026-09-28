// Modelo de programa de television
const mongoose = require('mongoose');

const programaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  sinopsis: { type: String, required: true },
  poster: { type: String, required: true },  // url de la imagen
  trailer: { type: String, default: '' },     // url del video (YouTube)
  productora: { type: String, required: true },
  anio: { type: Number },
  // referencia a la coleccion de categorias
  categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Programa', programaSchema);
