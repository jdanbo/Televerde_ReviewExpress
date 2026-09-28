// Limites de peticiones con express-rate-limit
const rateLimit = require('express-rate-limit');

// Limite general: 100 peticiones cada 15 minutos por IP
const limiteGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: { ok: false, mensaje: 'Demasiadas peticiones, intenta en unos minutos' }
});

// Limite para login: 5 intentos cada 15 minutos (evita adivinar contraseñas)
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: { ok: false, mensaje: 'Demasiados intentos de login, espera 15 minutos' }
});

module.exports = { limiteGeneral, limiteLogin };
