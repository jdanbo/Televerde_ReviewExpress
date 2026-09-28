// Middleware que revisa si las validaciones del DTO fallaron
const { validationResult } = require('express-validator');

function validar(req, res, next) {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    // devolvemos solo el mensaje y el campo para que sea facil de leer
    const lista = errores.array().map(e => ({ campo: e.path, mensaje: e.msg }));
    return res.status(400).json({ ok: false, errores: lista });
  }
  next();
}

module.exports = validar;
