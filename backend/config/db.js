// Conexion a MongoDB usando mongoose
const mongoose = require('mongoose');

async function conectarDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.log('Error al conectar a MongoDB:', error.message);
    process.exit(1); // si no hay base de datos, apagamos el servidor
  }
}

module.exports = conectarDB;
