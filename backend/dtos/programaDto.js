// DTO de programa
const { body } = require('express-validator');

const programaDto = [
  body('titulo').trim().notEmpty().withMessage('El titulo es obligatorio'),
  body('sinopsis').trim().isLength({ min: 10 }).withMessage('La sinopsis debe tener al menos 10 caracteres'),
  body('poster').trim().isURL().withMessage('El poster debe ser una url valida'),
  body('trailer').optional({ values: 'falsy' }).trim().isURL().withMessage('El trailer debe ser una url valida'),
  body('productora').trim().notEmpty().withMessage('La productora es obligatoria'),
  body('anio').optional({ values: 'falsy' }).isInt({ min: 1900, max: 2100 }).withMessage('Año no valido'),
  body('categoria').isMongoId().withMessage('Selecciona una categoria valida')
];

module.exports = { programaDto };
