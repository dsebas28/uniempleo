-- ============================================================
-- UniEmpleo — Esquema de Base de Datos (PostgreSQL)
-- Se ejecuta al iniciar el backend; es idempotente (IF NOT EXISTS).
-- ============================================================

-- Usuarios base (todos los roles)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  updated_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- Perfiles de estudiante
CREATE TABLE IF NOT EXISTS students (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  university TEXT NOT NULL,
  career TEXT NOT NULL,
  semester SMALLINT NOT NULL DEFAULT 1,
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
  available_travel BOOLEAN NOT NULL DEFAULT FALSE,
  available_relocate BOOLEAN NOT NULL DEFAULT FALSE,
  has_vehicle BOOLEAN NOT NULL DEFAULT FALSE,
  birth_date DATE,
  gender TEXT,
  nationality TEXT,
  marital_status TEXT,
  document_id TEXT,
  address TEXT,
  department TEXT,
  country TEXT DEFAULT 'Colombia',
  education_level TEXT,
  interests TEXT,
  profile_completion SMALLINT DEFAULT 30 CHECK (profile_completion BETWEEN 0 AND 100),
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  updated_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- Perfiles de empresa
CREATE TABLE IF NOT EXISTS companies (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  nit VARCHAR(20) NOT NULL,
  phone TEXT,
  city TEXT NOT NULL,
  sector TEXT NOT NULL,
  description TEXT,
  mission TEXT,
  logo TEXT,
  website TEXT,
  linkedin TEXT,
  instagram TEXT,
  approved BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  updated_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- Administradores
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL
);

-- Vacantes
CREATE TABLE IF NOT EXISTS jobs (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  skills TEXT,
  benefits TEXT,
  salary_min INTEGER CHECK (salary_min >= 0),
  salary_max INTEGER CHECK (salary_max >= 0),
  city TEXT NOT NULL,
  modality VARCHAR(12) NOT NULL CHECK (modality IN ('Remoto', 'Híbrido', 'Presencial')),
  contract_type TEXT NOT NULL,
  experience_years SMALLINT DEFAULT 0 CHECK (experience_years >= 0),
  education_level TEXT,
  area TEXT NOT NULL,
  is_internship BOOLEAN NOT NULL DEFAULT FALSE,
  no_experience_ok BOOLEAN NOT NULL DEFAULT FALSE,
  deadline DATE,
  status VARCHAR(10) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'closed')),
  applicants_count INTEGER DEFAULT 0 CHECK (applicants_count >= 0),
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  updated_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  CONSTRAINT jobs_salary_range CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
);

-- Postulaciones
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  status VARCHAR(12) NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'reviewing', 'preselected', 'interview', 'selected', 'rejected')),
  cover_letter TEXT,
  applied_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  updated_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  UNIQUE (student_id, job_id)
);

-- Vacantes guardadas
CREATE TABLE IF NOT EXISTS saved_jobs (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  UNIQUE (student_id, job_id)
);

-- Habilidades catálogo
CREATE TABLE IF NOT EXISTS skills (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  category TEXT
);

-- Habilidades de estudiante
CREATE TABLE IF NOT EXISTS student_skills (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  skill_id INTEGER NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'Intermedio',
  UNIQUE (student_id, skill_id)
);

-- Idiomas de estudiante
CREATE TABLE IF NOT EXISTS student_languages (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  level TEXT NOT NULL,
  UNIQUE (student_id, language)
);

-- Educación
CREATE TABLE IF NOT EXISTS educations (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  field TEXT,
  start_year SMALLINT,
  end_year SMALLINT,
  current BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT educations_years CHECK (end_year IS NULL OR start_year IS NULL OR end_year >= start_year)
);

-- Experiencia laboral (fechas con precisión de mes: 'YYYY-MM', como las envía el formulario)
CREATE TABLE IF NOT EXISTS experiences (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date VARCHAR(10) NOT NULL,
  end_date VARCHAR(10),
  current BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT
);

-- Proyectos
CREATE TABLE IF NOT EXISTS projects (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  technologies TEXT,
  url TEXT
);

-- Cursos de UniEmpleo Academy
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration_hours SMALLINT NOT NULL CHECK (duration_hours > 0),
  level VARCHAR(12) NOT NULL CHECK (level IN ('Básico', 'Intermedio', 'Avanzado')),
  area TEXT NOT NULL,
  image_url TEXT,
  instructor TEXT,
  rating NUMERIC(2, 1) DEFAULT 4.5 CHECK (rating BETWEEN 0 AND 5),
  students_count INTEGER DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- Módulos de curso
CREATE TABLE IF NOT EXISTS course_modules (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes SMALLINT DEFAULT 30,
  order_index SMALLINT NOT NULL
);

-- Inscripciones en cursos
CREATE TABLE IF NOT EXISTS enrollments (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  progress SMALLINT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  enrolled_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  completed_at TIMESTAMP(0),
  UNIQUE (student_id, course_id)
);

-- Notificaciones
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(10) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN NOT NULL DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- Entrevistas
CREATE TABLE IF NOT EXISTS interviews (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMP(0) NOT NULL,
  notes TEXT,
  status VARCHAR(10) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- Favoritos (empresas y cursos): item_id apunta a companies o courses según item_type
CREATE TABLE IF NOT EXISTS favorites (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  item_type VARCHAR(10) NOT NULL CHECK (item_type IN ('company', 'course')),
  item_id INTEGER NOT NULL,
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  UNIQUE (student_id, item_type, item_id)
);

-- Alertas de empleo (preferencias para avisar por correo cuando se publique una vacante que coincida)
CREATE TABLE IF NOT EXISTS job_alerts (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  area TEXT,
  city TEXT,
  modality TEXT,
  keywords TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0),
  updated_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- Bandeja de correos de alerta enviados (simulado: no se envía un correo real todavía)
CREATE TABLE IF NOT EXISTS email_log (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
  alert_id INTEGER REFERENCES job_alerts(id) ON DELETE SET NULL,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_at TIMESTAMP(0) NOT NULL DEFAULT LOCALTIMESTAMP(0)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_area ON jobs(area);
CREATE INDEX IF NOT EXISTS idx_jobs_city ON jobs(city);
CREATE INDEX IF NOT EXISTS idx_jobs_modality ON jobs(modality);
CREATE INDEX IF NOT EXISTS idx_jobs_status_created ON jobs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_student ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_student ON saved_jobs(student_id);
CREATE INDEX IF NOT EXISTS idx_job_alerts_student ON job_alerts(student_id);
CREATE INDEX IF NOT EXISTS idx_email_log_student ON email_log(student_id);
