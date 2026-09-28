// Rutas de personajes
const express = require('express');
const router = express.Router();

const personaje = require('../controllers/personajeController');
const { personajeDto } = require('../dtos/personajeDto');
const { idDto } = require('../dtos/categoriaDto');
const validar = require('../dtos/validar');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.get('/', verificarToken, personaje.listar);
router.post('/', verificarToken, soloAdmin, personajeDto, validar, personaje.crear);
router.put('/:id', verificarToken, soloAdmin, idDto, personajeDto, validar, personaje.actualizar);
router.delete('/:id', verificarToken, soloAdmin, idDto, validar, personaje.eliminar);

module.exports = router;
