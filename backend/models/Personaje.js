// Modelo de personaje, guarda tambien el actor que lo interpreta
const mongoose = require('mongoose');

const personajeSchema = new mongoose.Schema({
  programa: { type: mongoose.Schema.Types.ObjectId, ref: 'Programa', required: true },
  nombre: { type: String, required: true },
  actor: { type: String, required: true } // actor o actor de voz
}, { timestamps: true });

module.exports = mongoose.model('Personaje', personajeSchema);
