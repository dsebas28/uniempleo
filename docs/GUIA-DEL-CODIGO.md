# Guía del código

Recorrido por el código de UniEmpleo para entender cómo está construido. Los fragmentos son copias literales del repositorio.

## Contenido

1. [Cómo está organizado](#1-cómo-está-organizado)
2. [El recorrido de una petición](#2-el-recorrido-de-una-petición)
3. [Conexión a PostgreSQL](#3-conexión-a-postgresql)
4. [Autenticación y roles](#4-autenticación-y-roles)
5. [Modelos: el SQL vive en un solo lugar](#5-modelos-el-sql-vive-en-un-solo-lugar)
6. [Servicios: las reglas de negocio](#6-servicios-las-reglas-de-negocio)
7. [Transacciones](#7-transacciones)
8. [Alertas de empleo](#8-alertas-de-empleo)
9. [Subida de archivos](#9-subida-de-archivos)
10. [Frontend](#10-frontend)
11. [Datos de demostración y pruebas](#11-datos-de-demostración-y-pruebas)

## 1. Cómo está organizado

```
backend/src/
  index.js            Arranca Express: crea las tablas, carga la demo y escucha en el puerto 5000
  routes/             Qué URL atiende cada controlador y qué rol necesita
  controllers/        Reciben la petición, llaman al servicio y responden (códigos HTTP)
  services/           Reglas de negocio: quién puede hacer qué y en qué orden
  models/             Todo el SQL, un archivo por entidad
  middleware/         auth.js (JWT y roles) y upload.js (CV en PDF y fotos)
  database/           db.js (conexión), schema.sql, seed.js y enrich.js (datos de la demo)
backend/tests/        Prueba de punta a punta de la API
frontend/src/
  pages/              Una página por pantalla: públicas, student/, company/, admin/
  layouts/            Estructura de cada zona (menú lateral del estudiante, de la empresa, del admin)
  services/api.js     Cliente HTTP (axios) con el token incluido en cada petición
  routes/             ProtectedRoute: rutas solo para un rol
```

## 2. El recorrido de una petición

Cuando una empresa cambia el estado de un candidato:

```
PUT /api/companies/me/candidates/42/status
  │
  ├─ routes/company.js         authenticate ▸ requireRole('company')
  ├─ companyController         lee el cuerpo y llama al servicio
  ├─ applicationService        ¿la postulación es de una vacante de esta empresa? ¿el estado es válido?
  ├─ applicationModel          UPDATE applications SET status = ...
  ├─ notificationModel         INSERT INTO notifications (aviso al estudiante)
  └─ respuesta 200 { message }
```

Cada capa tiene un solo trabajo: el controlador no conoce SQL y el modelo no conoce HTTP.

## 3. Conexión a PostgreSQL

`backend/src/database/db.js` crea un **pool de conexiones** con `pg` y expone la misma forma de trabajo en todo el proyecto: `db.prepare(sql).get / all / run`, todas asíncronas.

```js
// Las consultas se escriben con "?" y se traducen a los parámetros posicionales
// de PostgreSQL ($1, $2...). Los valores nunca se concatenan al SQL.
function toPostgres(sql) {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}
```

Los valores viajan aparte del texto de la consulta, así que **no hay inyección SQL posible** aunque un usuario escriba `' OR 1=1 --` en el buscador.

Además, `db.js` ajusta cómo llegan algunos tipos para que la API responda igual que antes de la migración:

```js
types.setTypeParser(20, (v) => parseInt(v, 10));     // bigint (COUNT(*)) -> número
types.setTypeParser(1700, (v) => parseFloat(v));     // numeric (rating)  -> número
types.setTypeParser(16, (v) => (v === 't' ? 1 : 0)); // boolean -> 1 / 0 (el frontend compara con 1 y 0)
types.setTypeParser(1114, (v) => v);                 // timestamp -> 'YYYY-MM-DD HH:MM:SS'
types.setTypeParser(1082, (v) => v);                 // date      -> 'YYYY-MM-DD'
```

Sin la primera línea, `COUNT(*)` llegaría como texto (`"28"`) porque PostgreSQL lo devuelve como `bigint`.

## 4. Autenticación y roles

- Las contraseñas se guardan cifradas con **bcrypt** (`authService.registerStudent`).
- Al iniciar sesión se firma un **JWT** con el id y el rol; el frontend lo envía en la cabecera `Authorization: Bearer ...`.
- `middleware/auth.js` valida el token y **vuelve a leer el usuario** en cada petición:

```js
// Se consulta el usuario en cada petición: una cuenta desactivada pierde el acceso al instante
const user = await userModel.findById(payload.userId || payload.id);
if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
if (!user.active) return res.status(403).json({ error: 'Tu cuenta ha sido desactivada o bloqueada por la administración' });
```

Así, si el administrador suspende una cuenta, el token que esa persona ya tenía deja de servir en la siguiente petición.

- `requireRole('company')` se pone en cada ruta: un estudiante que llame a `/api/companies/me/jobs` recibe 403.

## 5. Modelos: el SQL vive en un solo lugar

Cada archivo de `models/` agrupa las consultas de una entidad. Un ejemplo que aprovecha PostgreSQL: los indicadores del panel de la empresa salen de **una sola consulta** con `FILTER` (`models/companyModel.js`):

```js
SELECT (SELECT COUNT(*) FROM jobs WHERE company_id = ? AND status = 'active')  AS "activeJobs",
       COUNT(a.id)                                                            AS "totalApplications",
       COUNT(a.id) FILTER (WHERE a.status = 'interview')                      AS interviews,
       COUNT(a.id) FILTER (WHERE a.status = 'reviewing')                      AS reviewing,
       COUNT(a.id) FILTER (WHERE a.status = 'selected')                       AS selected,
       COUNT(DISTINCT a.student_id)                                           AS candidates
FROM applications a
JOIN jobs j ON a.job_id = j.id
WHERE j.company_id = ?
```

Antes eran cuatro consultas separadas. Las comillas en `"activeJobs"` mantienen el nombre en camelCase que espera el frontend (PostgreSQL pasa a minúsculas los nombres sin comillas).

Cuando varias consultas no dependen entre sí, se lanzan **en paralelo** (`models/studentModel.js`):

```js
const [skills, educations, experiences, languages] = await Promise.all([ ... ]);
```

## 6. Servicios: las reglas de negocio

`services/applicationService.js` decide si alguien puede postularse:

```js
async applyToJob(userId, jobId, { coverLetter } = {}) {
  const student = await studentModel.findByUserId(userId);
  if (!student) {
    throw new Error('Debes completar tu perfil de estudiante antes de postularte');
  }

  const job = await jobModel.getById(jobId);
  if (!job || job.status !== 'active') {
    throw new Error('La oferta laboral no se encuentra activa');
  }

  if (await applicationModel.hasApplied(jobId, student.id)) {
    throw new Error('Ya te has postulado a esta vacante anteriormente');
  }
```

Las reglas se comprueban en el servicio para dar un mensaje claro, y la base de datos las garantiza de todas formas (`UNIQUE (student_id, job_id)`): si dos peticiones llegan a la vez, solo una se guarda.

Al cambiar el estado de un candidato, el servicio comprueba que la postulación sea de una vacante **de esa empresa** (`findByIdAndCompany`): una empresa no puede tocar candidatos de otra cambiando el id en la URL.

## 7. Transacciones

`db.js` ofrece `transaction(fn)`: todo lo que se haga dentro se guarda junto o no se guarda nada.

```js
async function transaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(wrap(client));
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
```

Se usa donde una operación son varios pasos:

- **Habilidades del perfil** (`studentModel.setSkills`): borra las anteriores e inserta las nuevas; si algo falla a mitad, el estudiante conserva las que tenía.
- **Inscripción a un curso** (`courseModel.enroll`): inserta la inscripción y suma 1 al contador del curso **solo si la inscripción era nueva**.
- **Datos de la demo** (`seed.js`): o se carga la demo completa o no queda una base a medias.

## 8. Alertas de empleo

Cuando una empresa publica una vacante, `jobAlertService.notifyMatchingStudents` busca las alertas activas que coinciden (área, ciudad, modalidad y palabra clave) y por cada una:

1. registra el correo en `email_log` (el envío por SMTP está simulado: el administrador ve la bandeja en `/admin/alertas-email`);
2. crea una notificación dentro de la aplicación para el estudiante.

## 9. Subida de archivos

`middleware/upload.js` usa **multer**:

- La hoja de vida solo acepta PDF y las fotos solo imágenes, con un máximo de 5 MB.
- El nombre del archivo lo genera el servidor (`cv_<usuario>_<fecha>_<aleatorio>.pdf`); el nombre original solo se guarda para mostrarlo.
- Al reemplazar o borrar un archivo, el servicio elimina también el anterior del disco.

## 10. Frontend

- **React 19 + Vite + Tailwind CSS v4**, gráficas con **Recharts** y animaciones con **framer-motion**.
- `services/api.js` añade el token a cada petición y, si el servidor responde 401, cierra la sesión y lleva al login.
- `routes/ProtectedRoute.jsx` envuelve las páginas de cada zona: `<ProtectedRoute roles={['company']}>`. Es comodidad de navegación; la seguridad real la decide el backend.
- Cada rol tiene su layout (`layouts/DashboardLayout.jsx`, `CompanyLayout.jsx`, `AdminLayout.jsx`) con su menú lateral.
- Vite redirige `/api` y `/uploads` al backend (`vite.config.js`), así que el frontend no necesita conocer la URL del servidor.

## 11. Datos de demostración y pruebas

- `npm run seed` crea las tablas (si faltan) y carga la demo: 10 empresas, 20 estudiantes, 28 vacantes, cursos con módulos, postulaciones, entrevistas, favoritos y notificaciones. Si la base ya tiene usuarios, no hace nada.
- `npm test` ejecuta `backend/tests/api.test.js` con el corredor de pruebas de Node (`node:test`) contra el backend en marcha. Recorre **todas las rutas** con los tres roles: búsqueda sin distinguir mayúsculas, registro, perfil completo del estudiante, publicación de vacantes, cambios de estado, panel de administración, permisos (401/403) y las restricciones de la base (un rango salarial invertido se rechaza).

```bash
cd backend
npm run dev     # en una terminal
npm test        # en otra
```

La prueba crea un estudiante y una empresa nuevos en cada ejecución (con correos únicos), así que conviene correrla sobre una base de desarrollo, no sobre la de la demo que se va a mostrar.
