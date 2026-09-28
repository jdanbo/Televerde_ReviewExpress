// Middlewares de autenticacion con JWT guardado en cookie
const jwt = require('jsonwebtoken');

// 1. Revisa que el usuario tenga un token valido
function verificarToken(req, res, next) {
  const token = req.cookies.token; // el token viaja en la cookie "token"

  if (!token) {
    return res.status(401).json({ ok: false, mensaje: 'Debes iniciar sesion' });
  }

  try {
    const datos = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = datos; // guardamos { id, nombre, rol } para usarlo despues
    next();
  } catch (error) {
    return res.status(401).json({ ok: false, mensaje: 'Sesion vencida, vuelve a entrar' });
  }
}

// 2. Revisa que el usuario sea administrador
function soloAdmin(req, res, next) {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ ok: false, mensaje: 'Solo el administrador puede hacer esto' });
  }
  next();
}

module.exports = { verificarToken, soloAdmin };
