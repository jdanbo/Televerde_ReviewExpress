# Televerde 📺

Proyecto Express 2026 · Daniel Borja

API y app web para gestionar programas de televisión (novelas, anime, cartoons).
Hecho con Express, MongoDB, JWT y JavaScript puro (sin frameworks en el frontend).

## Qué incluye

- **MVC**: `models/`, `controllers/`, `routes/`
- **DTOs y validaciones** con `express-validator` (carpeta `dtos/`)
- **JWT guardado en cookie** `httpOnly` (2 horas)
- **Roles**: `usuario` (solo ver) y `admin` (crear, editar, borrar)
- **Rate limit**: 100 peticiones / 15 min en general, 5 intentos de login / 15 min
- **Versionado semver**: cada petición debe mandar el header `x-api-version` (se acepta `^1.0.0`)
- **Frontend**: login/registro, catálogo, detalle con trailer, panel admin

## Cómo correrlo

```bash
cd backend
npm install
copy .env.example .env    # (Windows) y llena tus datos reales
npm run seed              # crea el admin y datos de prueba
npm run dev               # servidor en http://localhost:3000
```

Abre `http://localhost:3000` en el navegador. La entrada siempre es `index.html`:
si no has iniciado sesión te manda al login y, al entrar, regresas al index.
Admin por defecto: el `ADMIN_EMAIL` y `ADMIN_PASSWORD` de tu `.env`. Solo el admin ve el botón **Panel admin**.

## Variables de entorno (.env)

Crea el archivo `backend/.env` copiando `backend/.env.example`:

| Variable | Para qué sirve | Ejemplo |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `MONGO_URI` | Conexión a MongoDB Atlas (la misma de Compass) | `mongodb+srv://USUARIO:PASSWORD@cluster0.xxxxx.mongodb.net/televerde` |
| `JWT_SECRET` | Palabra secreta para firmar los tokens | `una_frase_larga_y_secreta` |
| `ADMIN_EMAIL` | Email del admin que crea el seed | `admin@televerde.com` |
| `ADMIN_PASSWORD` | Contraseña del admin que crea el seed | `Admin123` |

> El `.env` real nunca se sube a GitHub (está en `.gitignore`). En `.env.example` solo van valores de ejemplo.

> ⚠️ En MongoDB Atlas, entra a **Network Access** y agrega tu IP, si no, no conecta.

## Rutas de la API (`/api/v1`)

| Método | Ruta | Quién |
|---|---|---|
| POST | `/auth/registro` | Público |
| POST | `/auth/login` | Público |
| POST | `/auth/logout` | Público |
| GET | `/auth/perfil` | Logueado |
| GET | `/categorias` | Logueado |
| POST / PUT / DELETE | `/categorias/:id` | Admin |
| GET | `/programas?categoria=ID&buscar=texto` | Logueado |
| GET | `/programas/:id` (incluye capítulos y personajes) | Logueado |
| POST / PUT / DELETE | `/programas/:id` | Admin |
| GET | `/capitulos?programa=ID` | Logueado |
| POST / PUT / DELETE | `/capitulos/:id` | Admin |
| GET | `/personajes?programa=ID` | Logueado |
| POST / PUT / DELETE | `/personajes/:id` | Admin |

### Probar en Postman / Thunder Client
Agrega siempre el header `x-api-version: 1.0.0`. Después de hacer login, la cookie se guarda sola.

## Estructura

```
backend/
  app.js            → servidor principal
  config/db.js      → conexión a MongoDB
  models/           → Usuario, Categoria, Programa, Capitulo, Personaje
  controllers/      → lógica de cada recurso
  routes/           → rutas (v1.js agrupa todo)
  dtos/             → validaciones
  middlewares/      → auth (JWT + roles), limiter, version (semver)
  scripts/seed.js   → datos de prueba
frontend/
  index.html        → catálogo (usuario)
  programa.html     → detalle
  admin.html        → panel admin
  login.html        → login y registro
  css/estilos.css
  js/               → api.js (compartido) + un archivo por página
```
