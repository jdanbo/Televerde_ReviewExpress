// Rutas de categorias
// Leer: cualquier usuario logueado | Crear, editar, borrar: solo admin
const express = require('express');
const router = express.Router();

const categoria = require('../controllers/categoriaController');
const { categoriaDto, idDto } = require('../dtos/categoriaDto');
const validar = require('../dtos/validar');
const { verificarToken, soloAdmin } = require('../middlewares/auth');

router.get('/', verificarToken, categoria.listar);
router.post('/', verificarToken, soloAdmin, categoriaDto, validar, categoria.crear);
router.put('/:id', verificarToken, soloAdmin, idDto, categoriaDto, validar, categoria.actualizar);
router.delete('/:id', verificarToken, soloAdmin, idDto, validar, categoria.eliminar);

module.exports = router;
