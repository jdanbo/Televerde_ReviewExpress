// DTO de categoria
const { body, param } = require('express-validator');

const idDto = [
  param('id').isMongoId().withMessage('El id no es valido')
];

const categoriaDto = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 30 }).withMessage('Maximo 30 caracteres'),
  body('color').optional().isHexColor().withMessage('El color debe ser hexadecimal, ej: #1db954')
];

module.exports = { categoriaDto, idDto };
