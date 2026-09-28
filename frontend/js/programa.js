// =========================================
// programa.js - detalle de un programa
// =========================================

async function iniciar() {
  const usuario = await obtenerUsuario();
  if (!usuario) return;
  pintarHeader(usuario);

  // leemos el id de la url: programa.html?id=XXXX
  const id = new URLSearchParams(location.search).get('id');
  if (!id) return (location.href = 'index.html');

  const res = await peticion(`/programas/${id}`);
  if (!res.ok) {
    document.getElementById('productora').textContent = textoErrores(res);
    return;
  }

  const { programa, capitulos, personajes } = res.datos;
  document.title = `Televerde · ${programa.titulo}`;

  // Parte de arriba
  document.getElementById('hero').style.backgroundImage = `url('${programa.poster}')`;
  document.getElementById('productora').textContent = `${programa.productora} presenta`;
  document.getElementById('categoria').textContent = programa.categoria?.nombre || '';
  document.getElementById('titulo').textContent = programa.titulo;
  document.getElementById('sinopsis').textContent = programa.sinopsis;
  document.getElementById('meta').innerHTML = `
    <span>${programa.anio || 'N/D'}</span>
    <span>${capitulos.length} capítulos</span>
    <span>${limpiar(programa.productora)}</span>
  `;
  document.getElementById('btnPlay').onclick = () => abrirTrailer(programa.trailer);

  // Capitulos
  document.getElementById('capitulos').innerHTML = capitulos.length
    ? capitulos.map(c => `
        <li>
          <span><b>${c.numero}</b>${limpiar(c.titulo)}</span>
          <span>${c.duracion ? c.duracion + ' min' : ''}</span>
        </li>`).join('')
    : '<p class="vacio">Aún no hay capítulos</p>';

  // Personajes y actores
  document.getElementById('personajes').innerHTML = personajes.length
    ? personajes.map(p => `
        <div class="personaje">
          <strong>${limpiar(p.nombre)}</strong>
          <small>${limpiar(p.actor)}</small>
        </div>`).join('')
    : '<p class="vacio">Aún no hay personajes</p>';

  document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') cerrarTrailer();
  });
}

iniciar();
