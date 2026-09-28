// Rutas de programas
const express = require('express');
const router = express.Router();

const programa = require('../controllers/programaController');
const { programaDto } = require('../dtos/programaDto');
const { idDto } = require('../dtos/categoriaDto');
const validar = require('../dtos/validar');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.get('/', verificarToken, programa.listar);
router.get('/:id', verificarToken, idDto, validar, programa.obtenerUno);
router.post('/', verificarToken, soloAdmin, programaDto, validar, programa.crear);
router.put('/:id', verificarToken, soloAdmin, idDto, programaDto, validar, programa.actualizar);
router.delete('/:id', verificarToken, soloAdmin, idDto, validar, programa.eliminar);

module.exports = router;
