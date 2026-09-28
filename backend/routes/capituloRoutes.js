// Rutas de capitulos
const express = require('express');
const router = express.Router();

const capitulo = require('../controllers/capituloController');
const { capituloDto } = require('../dtos/capituloDto');
const { idDto } = require('../dtos/categoriaDto');
const validar = require('../dtos/validar');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.get('/', verificarToken, capitulo.listar);
router.post('/', verificarToken, soloAdmin, capituloDto, validar, capitulo.crear);
router.put('/:id', verificarToken, soloAdmin, idDto, capituloDto, validar, capitulo.actualizar);
router.delete('/:id', verificarToken, soloAdmin, idDto, validar, capitulo.eliminar);

module.exports = router;
