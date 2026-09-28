// DTOs de autenticacion: que datos se aceptan para registro y login
const { body } = require('express-validator');

const registroDto = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 letras'),
  body('email').trim().isEmail().withMessage('El email no es valido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const loginDto = [
  body('email').trim().isEmail().withMessage('El email no es valido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria')
];

module.exports = { registroDto, loginDto };
