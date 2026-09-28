// Agrupa todas las rutas de la version 1 de la API
const express = require('express');
const router = express.Router();

const verificarVersion = require('../middlewares/version');

// Todas las rutas v1 aceptan versiones 1.x.x (ej: 1.0.0, 1.2.3)
router.use(verificarVersion('^1.0.0'));

router.use('/auth', require('./authRoutes'));
router.use('/categorias', require('./categoriaRoutes'));
router.use('/programas', require('./programaRoutes'));
router.use('/capitulos', require('./capituloRoutes'));
router.use('/personajes', require('./personajeRoutes'));

module.exports = router;
