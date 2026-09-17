# UniEmpleo — Plataforma Web de Empleo Universitario y Primer Empleo

> **UniEmpleo** conecta a estudiantes universitarios y recién graduados con empresas comprometidas a brindar oportunidades de prácticas profesionales, pasantías y primeras experiencias laborales en Colombia y Latinoamérica.

---

## 🚀 Arquitectura Tecnológica

La plataforma está diseñada con una arquitectura desacoplada full-stack:

### Frontend
- **Framework**: React 19 + Vite 8
- **Estilos**: TailwindCSS v4 + CSS personalizado + Google Fonts (Outfit & Inter)
- **Enrutamiento**: React Router DOM v7 con control de acceso por roles (`student`, `company`, `admin`)
- **Visualización de Datos**: Recharts (Gráficos de barras, pastel, áreas de postulaciones y analítica de mercado)
- **Iconografía**: Lucide React + SVGs optimizados
- **Notificaciones**: React Hot Toast

### Backend
- **Entorno**: Node.js + Express 4
- **Base de Datos**: SQLite nativo con motor de alto rendimiento `better-sqlite3` y modo WAL activado
- **Seguridad**: Autenticación mediante JWT (JSON Web Tokens) y cifrado de contraseñas con `bcryptjs`
- **CORS & Proxy**: Configuración completa con proxy inverso en Vite (`/api` → `http://localhost:5000`)

---

## 👥 Cuentas de Demostración (Seed Data)

La base de datos viene precargada con datos realistas para probar todos los flujos de la plataforma:

| Rol | Correo Electrónico | Contraseña | Descripción |
|---|---|---|---|
| **Estudiante** | `estudiante@demo.com` | `demo1234` | Estudiante de Ing. de Sistemas (Carlos Martínez) con postulaciones, favoritos y CV |
| **Estudiante 2** | `ana.garcia@demo.com` | `demo1234` | Estudiante de Administración de Empresas |
| **Empresa** | `empresa@demo.com` | `demo1234` | Empresa TechCo SAS con vacantes publicadas y postulantes para revisar |
| **Empresa 2** | `datacorp@demo.com` | `demo1234` | DataCorp Colombia (Sector Analítica) |
| **Administrador** | `admin@uniempleo.com` | `admin1234` | Panel general de control, validación de empresas, usuarios y reportes |

---

## ⚡ Inicio Automatizado (En 1 Clic o 1 Comando)

Puedes levantar tanto el Backend como el Frontend y abrir el navegador automáticamente de cualquiera de estas formas:

- **Doble clic en Windows**: Ejecuta el archivo [`iniciar-uniempleo.bat`](file:///c:/Users/dseba_ow/Desktop/pagina%20de%20empleo%20universitario/iniciar-uniempleo.bat) ubicado en la raíz del proyecto.
- **Desde la terminal raíz**:
  ```bash
  npm start
  ```
- **Con PowerShell**:
  ```powershell
  ./iniciar.ps1
  ```

---

## 🛠️ Inicio Manual (Paso a Paso)

### 1. Iniciar el Backend

Abre una terminal en la carpeta raíz del proyecto:

```bash
cd backend
npm install
npm run dev
```

> El servidor iniciará en `http://localhost:5000`. La base de datos SQLite se inicializa y se ubica automáticamente en `backend/data/uniempleo.db`.

*(Opcional) Si deseas reiniciar o regenerar los datos de prueba:*
```bash
node src/database/seed.js
```

### 2. Iniciar el Frontend

Abre otra terminal en la carpeta raíz del proyecto:

```bash
cd frontend
npm install
npm run dev
```

> La aplicación web estará disponible en `http://localhost:5173`.

---

## 🌟 Funcionalidades Principales

### 1. Portal Público y Búsqueda
- **Home interactivo**: Estadísticas en tiempo real, buscador inteligente por cargo/carrera/ciudad, categorías destacadas, testimonios y vacantes recientes.
- **Directorio de Empleos (`/empleos`)**: Filtros avanzados por modalidad (remoto, híbrido, presencial), rango salarial, tipo de contrato y sin experiencia requerida.
- **Detalle de Vacante (`/empleos/:id`)**: Descripción, responsabilidades, requisitos, beneficios y modal de postulación con carta de presentación.
- **Directorio de Prácticas (`/practicas`)**: Sección especializada exclusivamente en prácticas universitarias y pasantías.
- **Directorio de Empresas (`/empresas` y `/empresas/:id`)**: Perfiles corporativos con sellos de verificación, cultura de la empresa y ofertas activas.
- **UniEmpleo Academy (`/cursos` y `/cursos/:id`)**: Cursos y módulos formativos para preparación laboral con control de inscripción y avance.

### 2. Panel de Estudiantes (`/dashboard`)
- **KPIs de Empleabilidad**: Postulaciones activas, guardadas, entrevistas agendadas y porcentaje de perfil completado.
- **Línea de Tiempo de Postulaciones (`/postulaciones`)**: Seguimiento en tiempo real de cada etapa (`Postulado` ➔ `En Revisión` ➔ `Preseleccionado` ➔ `Entrevista` ➔ `Seleccionado`).
- **Mi Perfil Profesional (`/perfil`)**: Edición de carrera, universidad, semestre, GPA, habilidades interactivas y enlaces a portafolios/CV.
- **Favoritos (`/favoritos`)**: Guardado rápido de vacantes para aplicar posteriormente.
- **Centro de Notificaciones (`/notificaciones`)**: Avisos automáticos cuando una empresa cambia el estado de tu postulación.
- **Preparador de Entrevistas (`/preparacion`)**: Guía interactiva con preguntas frecuentes de recursos humanos, método STAR y consejos de negociación salarial.

### 3. Panel de Empresas (`/empresa/dashboard`)
- **Métricas de Reclutamiento**: Vacantes activas, total de postulaciones recibidas, entrevistas programadas y candidatos evaluados.
- **Gestor de Vacantes (`/empresa/vacantes`)**: Publicación, edición, pausa y eliminación de ofertas laborales.
- **Publicador Multietapa (`/empresa/vacantes/nueva`)**: Asistente en 4 pasos para definir datos básicos, responsabilidades, competencias requeridas y beneficios ofrecidos.
- **Gestión de Candidatos (`/empresa/candidatos`)**:
  - Filtro por vacante específica y estado de postulación.
  - Cálculo de porcentaje de afinidad / match con la oferta.
  - Visualización del perfil del estudiante, universidad, semestre y carta de presentación.
  - Actualización del estado del proceso con envío automático de notificación al estudiante.
- **Perfil Corporativo (`/empresa/perfil`)**: Personalización de datos de la empresa, redes sociales, visión y misión hacia practicantes.

### 4. Panel de Administración (`/admin`)
- **Dashboard Global**: Estadísticas consolidadas del ecosistema, gráficos de barras de vacantes por área y gráficos circulares de estado de postulaciones.
- **Auditoría de Usuarios (`/admin/usuarios`)**: Directorio con filtrado por rol y botones para activar o suspender cuentas de usuario.
- **Validación de Empresas (`/admin/empresas`)**: Revisión y aprobación de empresas para asegurar que sean ofertas laborales legítimas.
- **Moderación de Vacantes (`/admin/vacantes`)**: Control de calidad de las publicaciones con capacidad de pausar o cerrar ofertas que no cumplan las políticas.
- **Inteligencia y Reportes (`/admin/reportes`)**: Análisis de demanda laboral por ciudades, tendencias de modalidades de trabajo, embudo de conversión y exportación en formato imprimible.

---

## 📄 Licencia
Este proyecto es de código abierto bajo la licencia MIT.
