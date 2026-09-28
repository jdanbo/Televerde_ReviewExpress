// DTO de capitulo
const { body } = require('express-validator');

const capituloDto = [
  body('programa').isMongoId().withMessage('El programa no es valido'),
  body('numero').isInt({ min: 1 }).withMessage('El numero debe ser mayor a 0'),
  body('titulo').trim().notEmpty().withMessage('El titulo es obligatorio'),
  body('duracion').optional({ values: 'falsy' }).isInt({ min: 1 }).withMessage('La duracion debe ser en minutos')
];

module.exports = { capituloDto };
