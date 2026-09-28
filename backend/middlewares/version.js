// Verificacion de version de la API usando semver
// El cliente debe mandar el header "x-api-version" (ejemplo: 1.0.0)
const semver = require('semver');

// Esta funcion recibe el rango de versiones que acepta la ruta, ej: "^1.0.0"
function verificarVersion(rango) {
  return (req, res, next) => {
    const version = req.headers['x-api-version'];

    if (!version) {
      return res.status(400).json({ ok: false, mensaje: 'Falta el header x-api-version' });
    }

    if (!semver.valid(version)) {
      return res.status(400).json({ ok: false, mensaje: 'La version no tiene formato semver (ej: 1.0.0)' });
    }

    if (!semver.satisfies(version, rango)) {
      return res.status(400).json({ ok: false, mensaje: `Version ${version} no soportada, se acepta ${rango}` });
    }

    next();
  };
}

module.exports = verificarVersion;
