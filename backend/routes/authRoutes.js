// Rutas de autenticacion
const express = require('express');
const router = express.Router();

const auth = require('../controllers/authController');
const { registroDto, loginDto } = require('../dtos/authDto');
const validar = require('../dtos/validar');
const { verificarToken } = require('../middlewares/auth');
const { limiteLogin } = require('../middlewares/limiter');

router.post('/registro', registroDto, validar, auth.registro);
router.post('/login', limiteLogin, loginDto, validar, auth.login);
router.post('/logout', auth.logout);
router.get('/perfil', verificarToken, auth.perfil);

module.exports = router;
