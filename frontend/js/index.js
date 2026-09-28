// =========================================
// index.js - catalogo para el usuario
// =========================================

let programas = [];        // todos los programas
let categoriaActiva = '';  // id de la categoria seleccionada

async function iniciar() {
  const usuario = await obtenerUsuario();
  if (!usuario) return; // api.js ya lo manda al login

  pintarHeader(usuario, true);

  const resProgramas = await peticion('/programas');
  const resCategorias = await peticion('/categorias');

  programas = resProgramas.datos || [];

  pintarMiniaturas();          // primero las miniaturas...
  pintarHero(programas[0]);    // ...luego el destacado (asi marca la activa)
  pintarFila('filaEstrenos', programas);
  pintarTop();
  pintarCategorias(resCategorias.datos || []);

  // buscador del header
  document.getElementById('buscador').addEventListener('input', (e) => {
    const texto = e.target.value.toLowerCase();
    const filtrados = programas.filter(p => p.titulo.toLowerCase().includes(texto));
    pintarFila('filaEstrenos', filtrados);
    document.getElementById('tituloFila').innerHTML = texto ? 'Resultados<br>búsqueda' : 'Últimos<br>estrenos';
  });

  // cerrar modal haciendo clic afuera
  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') cerrarTrailer();
  });
}

// Programa destacado grande
function pintarHero(programa) {
  if (!programa) {
    document.getElementById('heroProductora').textContent = 'Aún no hay programas';
    return;
  }

  document.getElementById('hero').style.backgroundImage = `url('${programa.poster}')`;
  document.getElementById('heroProductora').textContent = `${programa.productora} presenta`;
  document.getElementById('heroCategoria').textContent = programa.categoria?.nombre || '';
  document.getElementById('heroTitulo').textContent = programa.titulo;
  document.getElementById('heroSinopsis').textContent = programa.sinopsis;
  document.getElementById('heroMeta').innerHTML = `
    <span>${programa.anio || 'N/D'}</span>
    <span>${limpiar(programa.categoria?.nombre || '')}</span>
    <span>Español</span>
  `;
  document.getElementById('heroPlay').onclick = () => abrirTrailer(programa.trailer);
  document.getElementById('heroVer').href = `programa.html?id=${programa._id}`;

  // marcar miniatura activa
  document.querySelectorAll('.hero-miniaturas img').forEach(img => {
    img.classList.toggle('activa', img.dataset.id === programa._id);
  });
}

// Miniaturas para cambiar el destacado (maximo 4)
function pintarMiniaturas() {
  const contenedor = document.getElementById('heroMiniaturas');
  contenedor.innerHTML = programas.slice(0, 4).map(p => `
    <img src="${p.poster}" alt="${limpiar(p.titulo)}" data-id="${p._id}">
  `).join('');

  contenedor.querySelectorAll('img').forEach(img => {
    img.addEventListener('click', () => {
      const programa = programas.find(p => p._id === img.dataset.id);
      pintarHero(programa);
    });
  });
}

// Crea el HTML de una tarjeta
function tarjetaHTML(p, numero = null) {
  return `
    <a class="tarjeta" href="programa.html?id=${p._id}">
      <img src="${p.poster}" alt="${limpiar(p.titulo)}" loading="lazy">
      ${numero ? `<span class="tarjeta-numero">${numero}</span>` : `
      <div class="tarjeta-info">
        <small>${limpiar(p.categoria?.nombre || '')}</small>
        <h3>${limpiar(p.titulo)}</h3>
      </div>`}
    </a>
  `;
}

function pintarFila(idFila, lista) {
  const fila = document.getElementById(idFila);
  fila.innerHTML = lista.length
    ? lista.map(p => tarjetaHTML(p)).join('')
    : '<p class="vacio">No hay programas para mostrar</p>';
}

// Top tendencia: por ahora los 5 mas antiguos (los "clasicos")
function pintarTop() {
  const top = [...programas].reverse().slice(0, 5);
  document.getElementById('filaTop').innerHTML = top.map((p, i) => tarjetaHTML(p, i + 1)).join('');
}

// Tarjetas de colores de categorias
function pintarCategorias(categorias) {
  const fila = document.getElementById('filaCategorias');
  fila.innerHTML = categorias.map(c => `
    <div class="tarjeta-categoria" data-id="${c._id}" style="background:${c.color}">
      ${limpiar(c.nombre)}
    </div>
  `).join('');

  fila.querySelectorAll('.tarjeta-categoria').forEach(tarjeta => {
    tarjeta.addEventListener('click', () => filtrarCategoria(tarjeta, categorias));
  });
}

// Filtrar estrenos por categoria (clic otra vez para quitar el filtro)
function filtrarCategoria(tarjeta, categorias) {
  const id = tarjeta.dataset.id;
  categoriaActiva = categoriaActiva === id ? '' : id;

  document.querySelectorAll('.tarjeta-categoria').forEach(t => {
    t.classList.toggle('activa', t.dataset.id === categoriaActiva);
  });

  const filtrados = categoriaActiva
    ? programas.filter(p => p.categoria?._id === categoriaActiva)
    : programas;

  const nombre = categorias.find(c => c._id === categoriaActiva)?.nombre;
  document.getElementById('tituloFila').innerHTML = nombre ? limpiar(nombre) : 'Últimos<br>estrenos';
  pintarFila('filaEstrenos', filtrados);
  document.getElementById('filaEstrenos').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

iniciar();
