-- ============================================================
-- UniEmpleo — Esquema de Base de Datos
-- SQLite (compatible con PostgreSQL con mínimos cambios)
-- ============================================================

PRAGMA foreign_keys = ON;

-- Usuarios base (todos los roles)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('student', 'company', 'admin')),
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Perfiles de estudiante
CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  university TEXT NOT NULL,
  career TEXT NOT NULL,
  semester INTEGER NOT NULL DEFAULT 1,
  city TEXT NOT NULL,
  phone TEXT,
  about_me TEXT,
  profile_photo TEXT,
  cv_pdf TEXT,
  cv_original_name TEXT,
  linkedin TEXT,
  github TEXT,
  portfolio TEXT,
  english_level TEXT DEFAULT 'Básico',
  availability TEXT DEFAULT 'Inmediata',
  preferred_modality TEXT DEFAULT 'Híbrido',
  headline TEXT,
  available_travel INTEGER DEFAULT 0,
  available_relocate INTEGER DEFAULT 0,
  has_vehicle INTEGER DEFAULT 0,
  birth_date TEXT,
  gender TEXT,
  nationality TEXT,
  marital_status TEXT,
  document_id TEXT,
  address TEXT,
  department TEXT,
  country TEXT DEFAULT 'Colombia',
  education_level TEXT,
  interests TEXT,
  profile_completion INTEGER DEFAULT 30,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Perfiles de empresa
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nit TEXT NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  sector TEXT NOT NULL,
  description TEXT,
  mission TEXT,
  logo TEXT,
  website TEXT,
  linkedin TEXT,
  instagram TEXT,
  approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL
);

-- Vacantes
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  skills TEXT,
  benefits TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  city TEXT NOT NULL,
  modality TEXT NOT NULL CHECK(modality IN ('Remoto', 'Híbrido', 'Presencial')),
  contract_type TEXT NOT NULL,
  experience_years INTEGER DEFAULT 0,
  education_level TEXT,
  area TEXT NOT NULL,
  is_internship INTEGER DEFAULT 0,
  no_experience_ok INTEGER DEFAULT 0,
  deadline TEXT,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'closed')),
  applicants_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Postulaciones
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK(status IN ('sent', 'reviewing', 'preselected', 'interview', 'selected', 'rejected')),
  cover_letter TEXT,
  applied_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(student_id, job_id)
);

-- Vacantes guardadas
CREATE TABLE IF NOT EXISTS saved_jobs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(student_id, job_id)
);

-- Habilidades catálogo
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  category TEXT
);

-- Habilidades de estudiante
CREATE TABLE IF NOT EXISTS student_skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'Intermedio',
  UNIQUE(student_id, skill_id)
);

-- Idiomas de estudiante
CREATE TABLE IF NOT EXISTS student_languages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  level TEXT NOT NULL,
  UNIQUE(student_id, language)
);

-- Educación
CREATE TABLE IF NOT EXISTS educations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_year INTEGER,
  end_year INTEGER,
  current INTEGER DEFAULT 0
);

-- Experiencia laboral
CREATE TABLE IF NOT EXISTS experiences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  current INTEGER DEFAULT 0,
  description TEXT
);

-- Proyectos
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  technologies TEXT,
  url TEXT
);

-- Cursos de UniEmpleo Academy
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_hours INTEGER NOT NULL,
  level TEXT NOT NULL CHECK(level IN ('Básico', 'Intermedio', 'Avanzado')),
  area TEXT NOT NULL,
  image_url TEXT,
  instructor TEXT,
  rating REAL DEFAULT 4.5,
  students_count INTEGER DEFAULT 0,
  active INTEGER DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Módulos de curso
CREATE TABLE IF NOT EXISTS course_modules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 30,
  order_index INTEGER NOT NULL
);

-- Inscripciones en cursos
CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  completed INTEGER DEFAULT 0,
  enrolled_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT,
  UNIQUE(student_id, course_id)
);

-- Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK(type IN ('info', 'success', 'warning', 'error')),
  read INTEGER DEFAULT 0,
  link TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Entrevistas
CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_at TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'completed', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Favoritos (empresas y cursos)
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK(item_type IN ('company', 'course')),
  item_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(student_id, item_type, item_id)
);

-- Alertas de empleo (preferencias para avisar por correo cuando se publique una vacante que coincida)
CREATE TABLE IF NOT EXISTS job_alerts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  area TEXT,
  city TEXT,
  modality TEXT,
  keywords TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Bandeja de correos de alerta enviados (simulado: no se envía un correo real todavía)
CREATE TABLE IF NOT EXISTS email_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  alert_id INTEGER REFERENCES job_alerts(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_area ON jobs(area);
CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_modality ON jobs(modality);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_student ON saved_jobs(student_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_student ON job_alerts(student_id);
CREATE INDEX IF NOT EXISTS idx_email_log_student ON email_log(student_id);
