// Controlador de autenticacion: registro, login, logout y perfil
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Opciones de la cookie donde guardamos el token
const opcionesCookie = {
  httpOnly: true,          // JavaScript del navegador no puede leerla (mas seguro)
  sameSite: 'strict',      // solo se envia desde nuestra propia pagina
  secure: process.env.NODE_ENV === 'production', // en produccion solo por https
  maxAge: 2 * 60 * 60 * 1000 // 2 horas
};

// POST /auth/registro
async function registro(req, res) {
  try {
    const { nombre, email, password } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ ok: false, mensaje: 'Ese email ya esta registrado' });
    }

    const passwordEncriptada = await bcrypt.hash(password, 10);
    // todos los que se registran son "usuario", el admin se crea con el seed
    const usuario = await Usuario.create({ nombre, email, password: passwordEncriptada });

    res.status(201).json({ ok: true, mensaje: 'Usuario creado', usuario: { id: usuario._id, nombre, email } });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al registrar', error: error.message });
  }
}

// POST /auth/login
async function login(req, res) {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos' });
    }

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    if (!passwordCorrecta) {
      return res.status(401).json({ ok: false, mensaje: 'Email o contraseña incorrectos' });
    }

    // creamos el token con los datos basicos del usuario
    const token = jwt.sign(
      { id: usuario._id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('token', token, opcionesCookie);
    res.json({ ok: true, mensaje: 'Bienvenido', usuario: { nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al iniciar sesion', error: error.message });
  }
}

// POST /auth/logout
function logout(req, res) {
  res.clearCookie('token', opcionesCookie);
  res.json({ ok: true, mensaje: 'Sesion cerrada' });
}

// GET /auth/perfil  (el frontend lo usa para saber quien esta logueado)
function perfil(req, res) {
  res.json({ ok: true, usuario: req.usuario });
}

module.exports = { registro, login, logout, perfil };
