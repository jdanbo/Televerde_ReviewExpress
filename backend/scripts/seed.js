// Script para llenar la base de datos con datos de prueba
// Se ejecuta con: npm run seed
const path = require('path');
// buscamos el .env en la carpeta backend, sin importar desde donde se ejecute
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Usuario = require('../models/Usuario');
const Categoria = require('../models/Categoria');
const Programa = require('../models/Programa');
const Capitulo = require('../models/Capitulo');
const Personaje = require('../models/Personaje');

// Revisa que el .env tenga todo lo necesario antes de empezar
function revisarEnv() {
  const faltan = ['MONGO_URI', 'JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD'].filter(v => !process.env[v]);
  if (faltan.length) {
    console.log('❌ Faltan variables en backend/.env:', faltan.join(', '));
    console.log('   Copia .env.example como .env y llénalo.');
    process.exit(1);
  }
  if (!process.env.MONGO_URI.startsWith('mongodb')) {
    console.log('❌ MONGO_URI debe empezar con mongodb+srv://');
    process.exit(1);
  }
}

async function seed() {
  revisarEnv();
  console.log('Conectando a MongoDB...');
  // si en 10 segundos no conecta, mostramos el error
  await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('Conectado, limpiando datos...');

  await Promise.all([
    Categoria.deleteMany(), Programa.deleteMany(),
    Capitulo.deleteMany(), Personaje.deleteMany()
  ]);

  // Administrador (si ya existe no lo duplicamos)
  const existeAdmin = await Usuario.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existeAdmin) {
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Usuario.create({ nombre: 'Administrador', email: process.env.ADMIN_EMAIL, password, rol: 'admin' });
    console.log('Admin creado:', process.env.ADMIN_EMAIL);
  }

  // Categorias
  const [novelas, anime, cartoons] = await Categoria.insertMany([
    { nombre: 'Novelas', color: '#0f9d58' },
    { nombre: 'Anime', color: '#00bfa5' },
    { nombre: 'Cartoons', color: '#7cb342' }
  ]);

  // Programas: animes populares en emision (posters de MyAnimeList)
  const lista = [
    { titulo: 'Re:Zero 4ta Temporada', sinopsis: 'Tras la dura batalla en la ciudad de Priestella, Subaru y sus aliados enfrentan nuevas amenazas mientras Subaru sigue regresando de la muerte para proteger a los que ama.', poster: 'https://cdn.myanimelist.net/images/anime/1540/155824l.jpg', productora: 'White Fox', anio: 2026, categoria: anime._id },
    { titulo: 'JoJo: Steel Ball Run', sinopsis: 'En el viejo oeste americano comienza la carrera de caballos mas grande del mundo, donde Johnny y Gyro compiten por el premio y por un secreto mucho mayor.', poster: 'https://cdn.myanimelist.net/images/anime/1448/154111l.jpg', productora: 'David Production', anio: 2026, categoria: anime._id },
    { titulo: 'Mushoku Tensei III', sinopsis: 'Rudeus continua su nueva vida en un mundo de fantasia, decidido a no repetir los errores de su vida pasada.', poster: 'https://cdn.myanimelist.net/images/anime/1527/158340l.jpg', productora: 'Studio Bind', anio: 2026, categoria: anime._id },
    { titulo: 'One Piece', sinopsis: 'Monkey D. Luffy navega junto a su tripulacion en busca del legendario tesoro One Piece para convertirse en el Rey de los Piratas.', poster: 'https://cdn.myanimelist.net/images/anime/1244/138851l.jpg', productora: 'Toei Animation', anio: 1999, categoria: anime._id },
    { titulo: 'Youjo Senki II', sinopsis: 'Tanya, una soldado reencarnada en un mundo magico en guerra, sigue avanzando en el ejercito con estrategia y sin piedad.', poster: 'https://cdn.myanimelist.net/images/anime/1917/158371l.jpg', productora: 'Nut', anio: 2026, categoria: anime._id },
    { titulo: 'Chiikawa', sinopsis: 'Chiikawa y sus amigos, pequeñas criaturas adorables, viven aventuras cotidianas llenas de ternura, trabajo y uno que otro susto.', poster: 'https://cdn.myanimelist.net/images/anime/1783/121944l.jpg', productora: 'Doga Kobo', anio: 2022, categoria: cartoons._id }
  ];

  // los creamos uno por uno al reves, asi el primero de la lista sale como destacado
  const programas = [];
  for (const datos of [...lista].reverse()) {
    programas.unshift(await Programa.create(datos));
  }

  // Capitulos
  await Capitulo.insertMany([
    { programa: programas[0]._id, numero: 1, titulo: 'Episodio 1', duracion: 24 },
    { programa: programas[0]._id, numero: 2, titulo: 'Episodio 2', duracion: 24 },
    { programa: programas[0]._id, numero: 3, titulo: 'Episodio 3', duracion: 24 },
    { programa: programas[1]._id, numero: 1, titulo: 'Episodio 1', duracion: 24 },
    { programa: programas[3]._id, numero: 1, titulo: 'Episodio 1', duracion: 24 }
  ]);

  // Personajes con su actor de voz (seiyuu)
  await Personaje.insertMany([
    { programa: programas[0]._id, nombre: 'Subaru Natsuki', actor: 'Yuusuke Kobayashi' },
    { programa: programas[0]._id, nombre: 'Emilia', actor: 'Rie Takahashi' },
    { programa: programas[0]._id, nombre: 'Rem', actor: 'Inori Minase' },
    { programa: programas[3]._id, nombre: 'Monkey D. Luffy', actor: 'Mayumi Tanaka' },
    { programa: programas[3]._id, nombre: 'Roronoa Zoro', actor: 'Kazuya Nakai' }
  ]);

  console.log('Datos de prueba listos');
  await mongoose.disconnect();
}

seed().catch(error => {
  console.log('❌ Error en el seed:', error.message);

  // pistas segun el tipo de error mas comun
  const msg = error.message;
  if (msg.includes('bad auth') || msg.includes('Authentication failed')) {
    console.log('👉 Usuario o contraseña de la base de datos incorrectos (Atlas > Database Access).');
    console.log('   Si tu contraseña tiene @ : / # ? usa una sin simbolos o codificala.');
  } else if (msg.includes('whitelist') || msg.includes('Server selection timed out') || msg.includes('ECONNREFUSED')) {
    console.log('👉 Tu IP no tiene permiso: Atlas > Network Access > Add IP Address.');
  } else if (msg.includes('ENOTFOUND') || msg.includes('querySrv')) {
    console.log('👉 Revisa que la direccion del cluster en MONGO_URI este bien escrita y que tengas internet.');
  }
  process.exit(1);
});
