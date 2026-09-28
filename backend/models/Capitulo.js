// Modelo de capitulo, cada capitulo pertenece a un programa
const mongoose = require('mongoose');

const capituloSchema = new mongoose.Schema({
  programa: { type: mongoose.Schema.Types.ObjectId, ref: 'Programa', required: true },
  numero: { type: Number, required: true },
  titulo: { type: String, required: true },
  duracion: { type: Number, default: 0 } // en minutos
}, { timestamps: true });

module.exports = mongoose.model('Capitulo', capituloSchema);
