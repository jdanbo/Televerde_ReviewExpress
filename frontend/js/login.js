// =========================================
// login.js - inicio de sesion y registro
// =========================================

const formLogin = document.getElementById('formLogin');
const formRegistro = document.getElementById('formRegistro');
const mensaje = document.getElementById('mensaje');
const linkCambiar = document.getElementById('linkCambiar');

let modoRegistro = false;

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = 'mensaje ' + tipo;
}

// Cambiar entre login y registro
linkCambiar.addEventListener('click', () => {
  modoRegistro = !modoRegistro;
  formLogin.classList.toggle('oculto', modoRegistro);
  formRegistro.classList.toggle('oculto', !modoRegistro);
  document.getElementById('subtitulo').textContent = modoRegistro ? 'Crea tu cuenta gratis' : 'Inicia sesión para ver los programas';
  document.getElementById('textoCambiar').textContent = modoRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?';
  linkCambiar.textContent = modoRegistro ? 'Inicia sesión' : 'Regístrate';
  mostrarMensaje('', '');
});

// Login
formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = {
    email: document.getElementById('loginEmail').value,
    password: document.getElementById('loginPassword').value
  };

  const res = await peticion('/auth/login', 'POST', datos);

  if (res.ok) {
    // el admin va directo a su panel, el usuario al catalogo
    location.href = res.usuario.rol === 'admin' ? 'admin.html' : 'index.html';
  } else {
    mostrarMensaje(textoErrores(res), 'error');
  }
});

// Registro
formRegistro.addEventListener('submit', async (e) => {
  e.preventDefault();
  const datos = {
    nombre: document.getElementById('regNombre').value,
    email: document.getElementById('regEmail').value,
    password: document.getElementById('regPassword').value
  };

  const res = await peticion('/auth/registro', 'POST', datos);

  if (res.ok) {
    formRegistro.reset();
    linkCambiar.click(); // regresamos al login
    mostrarMensaje('Cuenta creada, ahora inicia sesión', 'exito');
  } else {
    mostrarMensaje(textoErrores(res), 'error');
  }
});
