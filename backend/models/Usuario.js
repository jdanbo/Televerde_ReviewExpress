// Modelo de usuario: puede ser "usuario" normal o "admin"
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // se guarda encriptada
  rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
