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

  // Programas de ejemplo (posters de prueba con picsum)
  const programas = await Programa.insertMany([
    { titulo: 'Amor en la Antigua', sinopsis: 'Una historia de amor y secretos familiares entre las calles empedradas de una ciudad colonial.', poster: 'https://picsum.photos/seed/novela1/400/600', productora: 'Estudios Quetzal', anio: 2024, categoria: novelas._id },
    { titulo: 'Guardianes del Volcan', sinopsis: 'Un grupo de jovenes descubre que puede controlar los elementos y debe proteger su pueblo.', poster: 'https://picsum.photos/seed/anime1/400/600', productora: 'Studio Ceiba', anio: 2025, categoria: anime._id },
    { titulo: 'Las Aventuras de Tito', sinopsis: 'Tito, un tacuazin curioso, vive aventuras divertidas en la selva junto a sus amigos.', poster: 'https://picsum.photos/seed/cartoon1/400/600', productora: 'Animados GT', anio: 2023, categoria: cartoons._id },
    { titulo: 'Corazon de Jade', sinopsis: 'Dos familias rivales se enfrentan por una herencia, pero el amor lo cambia todo.', poster: 'https://picsum.photos/seed/novela2/400/600', productora: 'Estudios Quetzal', anio: 2025, categoria: novelas._id }
  ]);

  // Capitulos y personajes del primer programa
  await Capitulo.insertMany([
    { programa: programas[0]._id, numero: 1, titulo: 'El reencuentro', duracion: 45 },
    { programa: programas[0]._id, numero: 2, titulo: 'La carta', duracion: 44 },
    { programa: programas[1]._id, numero: 1, titulo: 'El despertar', duracion: 24 }
  ]);

  await Personaje.insertMany([
    { programa: programas[0]._id, nombre: 'Lucia', actor: 'Maria Lopez' },
    { programa: programas[0]._id, nombre: 'Andres', actor: 'Carlos Perez' },
    { programa: programas[1]._id, nombre: 'Kai', actor: 'Diego Ramirez (voz)' }
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
