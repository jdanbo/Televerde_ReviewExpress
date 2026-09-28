// Modelo de categoria: novelas, anime, cartoons...
const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  color: { type: String, default: '#1db954' } // color de la tarjeta en el frontend
}, { timestamps: true });

module.exports = mongoose.model('Categoria', categoriaSchema);
