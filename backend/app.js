// Archivo principal del servidor
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cookieParser = require('cookie-parser');

const conectarDB = require('./config/db');
const { limiteGeneral } = require('./middlewares/limiter');

const app = express();

// Middlewares globales
app.use(express.json());   // para leer JSON del body
app.use(cookieParser());   // para leer cookies (ahi viaja el token)

// Servimos el frontend desde el mismo servidor (asi las cookies funcionan sin CORS)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas de la API con limite de peticiones
app.use('/api/v1', limiteGeneral, require('./routes/v1'));

// Si ninguna ruta de la API coincide
app.use('/api', (req, res) => {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

// Cualquier otra pagina que no exista regresa al index.html (entry point)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Arrancamos
const PORT = process.env.PORT || 3000;
conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});
