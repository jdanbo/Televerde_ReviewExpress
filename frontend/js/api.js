// =========================================
// api.js - funciones compartidas por todas las paginas
// =========================================

const API_URL = '/api/v1';
const API_VERSION = '1.0.0'; // se manda en cada peticion (semver)

// Funcion para hacer peticiones a la API
async function peticion(ruta, metodo = 'GET', datos = null) {
  const opciones = {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': API_VERSION
    },
    credentials: 'same-origin' // manda la cookie con el token
  };

  if (datos) opciones.body = JSON.stringify(datos);

  const respuesta = await fetch(API_URL + ruta, opciones);
  const json = await respuesta.json();

  // si la sesion vencio, mandamos al login
  if (respuesta.status === 401 && !location.pathname.includes('login')) {
    location.href = 'login.html';
  }

  return { status: respuesta.status, ...json };
}

// Revisa quien esta logueado. Si nadie, manda al login
async function obtenerUsuario() {
  const res = await peticion('/auth/perfil');
  return res.ok ? res.usuario : null;
}

async function cerrarSesion() {
  await peticion('/auth/logout', 'POST');
  location.href = 'login.html';
}

// Convierte los errores del DTO en un texto facil de leer
function textoErrores(res) {
  if (res.errores) return res.errores.map(e => e.mensaje).join(' · ');
  return res.mensaje || 'Algo salio mal';
}

// Convierte un link de YouTube normal a link "embed" para el iframe
function urlEmbed(url) {
  if (!url) return '';
  let id = '';
  if (url.includes('youtu.be/')) id = url.split('youtu.be/')[1].split('?')[0];
  else if (url.includes('watch?v=')) id = url.split('watch?v=')[1].split('&')[0];
  else if (url.includes('/embed/')) return url;
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
}

// Evita que texto escrito por usuarios se interprete como HTML
function limpiar(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}

// Pinta el header en cada pagina
function pintarHeader(usuario, conBuscador = false) {
  const header = document.getElementById('header');
  header.innerHTML = `
    <a href="index.html" class="logo">tele<span>verde.</span></a>
    <div class="header-acciones">
      ${conBuscador ? '<input id="buscador" class="buscador" type="search" placeholder="Buscar...">' : ''}
      <span class="saludo">Hola, ${limpiar(usuario.nombre)}</span>
      ${usuario.rol === 'admin' ? '<a href="admin.html" class="btn btn-verde btn-chico">Panel admin</a>' : ''}
      <button id="btnSalir" class="btn btn-borde btn-chico">Salir</button>
    </div>
  `;
  document.getElementById('btnSalir').addEventListener('click', cerrarSesion);
}

// Abrir / cerrar el modal del trailer
function abrirTrailer(url) {
  if (!url) return alert('Este programa aun no tiene trailer');
  document.getElementById('video').src = urlEmbed(url);
  document.getElementById('modal').classList.add('abierto');
}

function cerrarTrailer() {
  document.getElementById('video').src = '';
  document.getElementById('modal').classList.remove('abierto');
}
