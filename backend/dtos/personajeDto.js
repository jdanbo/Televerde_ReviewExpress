// DTO de personaje
const { body } = require('express-validator');

const personajeDto = [
  body('programa').isMongoId().withMessage('El programa no es valido'),
  body('nombre').trim().notEmpty().withMessage('El nombre del personaje es obligatorio'),
  body('actor').trim().notEmpty().withMessage('El actor es obligatorio')
];

module.exports = { personajeDto };
