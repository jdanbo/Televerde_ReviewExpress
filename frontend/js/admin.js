// =========================================
// admin.js - panel de administrador (CRUD)
// =========================================

let categorias = [];
let programas = [];
let capitulos = [];
let personajes = [];

// ---------- Inicio ----------
async function iniciar() {
  const usuario = await obtenerUsuario();
  if (!usuario) return;

  // si no es admin, lo regresamos al catalogo
  if (usuario.rol !== 'admin') return (location.href = 'index.html');

  pintarHeader(usuario);
  activarTabs();
  activarFormularios();
  await cargarTodo();
}

async function cargarTodo() {
  const [resCat, resProg, resCap, resPer] = await Promise.all([
    peticion('/categorias'),
    peticion('/programas'),
    peticion('/capitulos'),
    peticion('/personajes')
  ]);

  categorias = resCat.datos || [];
  programas = resProg.datos || [];
  capitulos = resCap.datos || [];
  personajes = resPer.datos || [];

  llenarSelects();
  pintarProgramas();
  pintarCategorias();
  pintarCapitulos();
  pintarPersonajes();
}

// ---------- Pestañas ----------
function activarTabs() {
  document.querySelectorAll('.tab').forEach(boton => {
    boton.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(b => b.classList.remove('activa'));
      document.querySelectorAll('.seccion-tab').forEach(s => s.classList.add('oculto'));
      boton.classList.add('activa');
      document.getElementById('tab-' + boton.dataset.tab).classList.remove('oculto');
    });
  });
}

// ---------- Selects de categorias y programas ----------
function llenarSelects() {
  document.querySelectorAll('.select-categorias').forEach(select => {
    select.innerHTML = '<option value="">Selecciona...</option>' +
      categorias.map(c => `<option value="${c._id}">${limpiar(c.nombre)}</option>`).join('');
  });

  document.querySelectorAll('.select-programas').forEach(select => {
    const valorAnterior = select.value;
    const primera = select.classList.contains('con-todos') ? 'Todos' : 'Selecciona...';
    select.innerHTML = `<option value="">${primera}</option>` +
      programas.map(p => `<option value="${p._id}">${limpiar(p.titulo)}</option>`).join('');
    select.value = valorAnterior;
  });
}

// ---------- Funciones genericas ----------
function mostrarMensaje(id, texto, tipo) {
  const p = document.getElementById(id);
  p.textContent = texto;
  p.className = 'mensaje ' + tipo;
}

// Crea (POST) o edita (PUT) segun si hay id
async function guardar(ruta, id, datos, idMensaje, formulario) {
  const res = id
    ? await peticion(`${ruta}/${id}`, 'PUT', datos)
    : await peticion(ruta, 'POST', datos);

  if (res.ok) {
    mostrarMensaje(idMensaje, res.mensaje, 'exito');
    formulario.reset();
    await cargarTodo();
  } else {
    mostrarMensaje(idMensaje, textoErrores(res), 'error');
  }
}

async function eliminar(ruta, id) {
  if (!confirm('¿Seguro que quieres eliminarlo?')) return;
  const res = await peticion(`${ruta}/${id}`, 'DELETE');
  if (!res.ok) alert(textoErrores(res));
  await cargarTodo();
}

function botonesAcciones(tipo, id) {
  return `
    <div class="acciones">
      <button class="btn btn-borde btn-chico" onclick="editar${tipo}('${id}')">Editar</button>
      <button class="btn btn-peligro btn-chico" onclick="eliminar${tipo}('${id}')">Borrar</button>
    </div>`;
}

// Al presionar "Limpiar" tambien borramos el id oculto (volvemos a modo crear)
function activarFormularios() {
  const formularios = {
    formPrograma: 'programaId', formCategoria: 'categoriaId',
    formCapitulo: 'capituloId', formPersonaje: 'personajeId'
  };
  for (const idForm in formularios) {
    document.getElementById(idForm).addEventListener('reset', () => {
      document.getElementById(formularios[idForm]).value = '';
    });
  }
  document.getElementById('formPrograma').addEventListener('reset', () => {
    document.getElementById('tituloFormPrograma').textContent = 'Nuevo programa';
  });

  document.getElementById('filtroCapitulos').addEventListener('change', pintarCapitulos);
  document.getElementById('filtroPersonajes').addEventListener('change', pintarPersonajes);
}

// =========================================
// PROGRAMAS
// =========================================
function pintarProgramas() {
  document.getElementById('tablaProgramas').innerHTML = programas.map(p => `
    <tr>
      <td><img src="${p.poster}" alt=""></td>
      <td>${limpiar(p.titulo)}</td>
      <td>${limpiar(p.categoria?.nombre || '-')}</td>
      <td>${limpiar(p.productora)}</td>
      <td>${botonesAcciones('Programa', p._id)}</td>
    </tr>`).join('') || '<tr><td colspan="5" class="vacio">Sin programas</td></tr>';
}

document.getElementById('formPrograma').addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = {
    titulo: document.getElementById('progTitulo').value,
    categoria: document.getElementById('progCategoria').value,
    sinopsis: document.getElementById('progSinopsis').value,
    poster: document.getElementById('progPoster').value,
    trailer: document.getElementById('progTrailer').value,
    productora: document.getElementById('progProductora').value,
    anio: document.getElementById('progAnio').value
  };
  const id = document.getElementById('programaId').value;
  guardar('/programas', id, datos, 'msgPrograma', e.target);
});

function editarPrograma(id) {
  const p = programas.find(x => x._id === id);
  document.getElementById('programaId').value = p._id;
  document.getElementById('progTitulo').value = p.titulo;
  document.getElementById('progCategoria').value = p.categoria?._id || '';
  document.getElementById('progSinopsis').value = p.sinopsis;
  document.getElementById('progPoster').value = p.poster;
  document.getElementById('progTrailer').value = p.trailer || '';
  document.getElementById('progProductora').value = p.productora;
  document.getElementById('progAnio').value = p.anio || '';
  document.getElementById('tituloFormPrograma').textContent = 'Editando: ' + p.titulo;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminarPrograma(id) { eliminar('/programas', id); }

// =========================================
// CATEGORIAS
// =========================================
function pintarCategorias() {
  document.getElementById('tablaCategorias').innerHTML = categorias.map(c => `
    <tr>
      <td><span style="display:inline-block;width:24px;height:24px;border-radius:4px;background:${c.color}"></span></td>
      <td>${limpiar(c.nombre)}</td>
      <td>${botonesAcciones('Categoria', c._id)}</td>
    </tr>`).join('') || '<tr><td colspan="3" class="vacio">Sin categorías</td></tr>';
}

document.getElementById('formCategoria').addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = {
    nombre: document.getElementById('catNombre').value,
    color: document.getElementById('catColor').value
  };
  const id = document.getElementById('categoriaId').value;
  guardar('/categorias', id, datos, 'msgCategoria', e.target);
});

function editarCategoria(id) {
  const c = categorias.find(x => x._id === id);
  document.getElementById('categoriaId').value = c._id;
  document.getElementById('catNombre').value = c.nombre;
  document.getElementById('catColor').value = c.color;
}

function eliminarCategoria(id) { eliminar('/categorias', id); }

// =========================================
// CAPITULOS
// =========================================
function pintarCapitulos() {
  const filtro = document.getElementById('filtroCapitulos').value;
  const lista = filtro ? capitulos.filter(c => c.programa?._id === filtro) : capitulos;

  document.getElementById('tablaCapitulos').innerHTML = lista.map(c => `
    <tr>
      <td>${c.numero}</td>
      <td>${limpiar(c.titulo)}</td>
      <td>${limpiar(c.programa?.titulo || '-')}</td>
      <td>${c.duracion || '-'}</td>
      <td>${botonesAcciones('Capitulo', c._id)}</td>
    </tr>`).join('') || '<tr><td colspan="5" class="vacio">Sin capítulos</td></tr>';
}

document.getElementById('formCapitulo').addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = {
    programa: document.getElementById('capPrograma').value,
    numero: document.getElementById('capNumero').value,
    titulo: document.getElementById('capTitulo').value,
    duracion: document.getElementById('capDuracion').value
  };
  const id = document.getElementById('capituloId').value;
  guardar('/capitulos', id, datos, 'msgCapitulo', e.target);
});

function editarCapitulo(id) {
  const c = capitulos.find(x => x._id === id);
  document.getElementById('capituloId').value = c._id;
  document.getElementById('capPrograma').value = c.programa?._id || '';
  document.getElementById('capNumero').value = c.numero;
  document.getElementById('capTitulo').value = c.titulo;
  document.getElementById('capDuracion').value = c.duracion || '';
}

function eliminarCapitulo(id) { eliminar('/capitulos', id); }

// =========================================
// PERSONAJES
// =========================================
function pintarPersonajes() {
  const filtro = document.getElementById('filtroPersonajes').value;
  const lista = filtro ? personajes.filter(p => p.programa?._id === filtro) : personajes;

  document.getElementById('tablaPersonajes').innerHTML = lista.map(p => `
    <tr>
      <td>${limpiar(p.nombre)}</td>
      <td>${limpiar(p.actor)}</td>
      <td>${limpiar(p.programa?.titulo || '-')}</td>
      <td>${botonesAcciones('Personaje', p._id)}</td>
    </tr>`).join('') || '<tr><td colspan="4" class="vacio">Sin personajes</td></tr>';
}

document.getElementById('formPersonaje').addEventListener('submit', (e) => {
  e.preventDefault();
  const datos = {
    programa: document.getElementById('perPrograma').value,
    nombre: document.getElementById('perNombre').value,
    actor: document.getElementById('perActor').value
  };
  const id = document.getElementById('personajeId').value;
  guardar('/personajes', id, datos, 'msgPersonaje', e.target);
});

function editarPersonaje(id) {
  const p = personajes.find(x => x._id === id);
  document.getElementById('personajeId').value = p._id;
  document.getElementById('perPrograma').value = p.programa?._id || '';
  document.getElementById('perNombre').value = p.nombre;
  document.getElementById('perActor').value = p.actor;
}

function eliminarPersonaje(id) { eliminar('/personajes', id); }

iniciar();
