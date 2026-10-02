const { transaction, closeDatabase } = require('./db');

// Enriquecimiento de la demo: completa las tablas que seed.js deja vacías o con pocos datos
// (educación, experiencia, habilidades e idiomas de TODOS los estudiantes, módulos de curso,
// más postulaciones y entrevistas, favoritos, guardados y notificaciones).
// Se puede ejecutar varias veces: antes de insertar comprueba qué existe y los duplicados
// se ignoran con ON CONFLICT DO NOTHING.

const CAREER_SKILLS = {
  'Ingeniería de Sistemas': ['JavaScript', 'Python', 'React', 'Node.js', 'SQL'],
  'Ingeniería Informática': ['Python', 'SQL', 'JavaScript', 'React'],
  'Ingeniería Electrónica': ['MATLAB', 'Excel', 'SQL'],
  'Ingeniería Mecatrónica': ['MATLAB', 'AutoCAD', 'Excel'],
  'Ingeniería Industrial': ['Excel', 'Gestión de Proyectos', 'Power BI'],
  'Ingeniería Civil': ['AutoCAD', 'Excel', 'Gestión de Proyectos'],
  'Ingeniería Ambiental': ['Excel', 'Gestión de Proyectos'],
  'Administración de Empresas': ['Excel', 'Gestión de Proyectos', 'Power BI'],
  'Administración de Negocios': ['Excel', 'Marketing Digital', 'Gestión de Proyectos'],
  'Diseño Gráfico': ['Photoshop', 'Illustrator', 'Figma'],
  'Psicología': ['Comunicación Efectiva', 'Trabajo en Equipo'],
  'Estadística': ['Python', 'SQL', 'Excel', 'Tableau'],
  'Comunicación Social': ['Marketing Digital', 'SEO/SEM', 'Comunicación Efectiva'],
  'Contaduría Pública': ['Contabilidad', 'Excel'],
  'Derecho': ['Comunicación Efectiva', 'Trabajo en Equipo'],
  'Medicina': ['Comunicación Efectiva', 'Trabajo en Equipo'],
  'Música': ['Comunicación Efectiva'],
  'Agronomía': ['Excel', 'Gestión de Proyectos'],
  'Fisioterapia': ['Comunicación Efectiva', 'Trabajo en Equipo'],
  'Nutrición y Dietética': ['Comunicación Efectiva', 'Excel'],
};

const EXPERIENCE_TEMPLATES = [
  { company: 'Freelance', role: (career) => `Asistente de ${career.split(' ').slice(-1)[0]}`, desc: 'Apoyo en proyectos independientes aplicando conocimientos de la carrera en casos reales de clientes locales.' },
  { company: 'Voluntariado Universitario', role: () => 'Monitor Académico', desc: 'Acompañamiento a estudiantes de semestres iniciales en cursos base de la facultad.' },
  { company: 'Práctica Empresarial', role: (career) => `Practicante de ${career}`, desc: 'Primera experiencia laboral aplicando los conocimientos técnicos de la carrera en un entorno corporativo real.' },
];

const PROJECT_TEMPLATES = {
  'Ingeniería de Sistemas': { name: 'Sistema de Gestión de Biblioteca', desc: 'Aplicación web full-stack para préstamo y control de inventario de libros universitarios.', tech: 'React, Node.js, PostgreSQL' },
  'Ingeniería Informática': { name: 'App de Seguimiento de Hábitos', desc: 'Aplicación móvil para registrar hábitos diarios con estadísticas de progreso.', tech: 'React Native, Firebase' },
  'Estadística': { name: 'Dashboard de Indicadores Económicos', desc: 'Panel interactivo con series de tiempo de indicadores macroeconómicos colombianos.', tech: 'Python, Power BI' },
  'Diseño Gráfico': { name: 'Rediseño de Marca ONG Local', desc: 'Proyecto de identidad visual completa para una fundación sin ánimo de lucro.', tech: 'Illustrator, Figma' },
  'Ingeniería Industrial': { name: 'Optimización de Línea de Producción', desc: 'Proyecto de grado sobre reducción de tiempos muertos en planta piloto universitaria.', tech: 'Excel, Simulación Lean' },
  'Comunicación Social': { name: 'Campaña Digital Universitaria', desc: 'Estrategia de contenido para redes sociales de un evento cultural del campus.', tech: 'Canva, Meta Business Suite' },
};

async function count(db, sql, ...params) {
  return (await db.prepare(sql).get(...params)).c;
}

async function enrichDatabase() {
  console.log('🌱 Enriqueciendo base de datos con datos completos...');

  await transaction(async (db) => {
    const students = await db.prepare('SELECT s.*, u.email FROM students s JOIN users u ON u.id = s.user_id ORDER BY s.id').all();
    const skills = await db.prepare('SELECT id, name FROM skills').all();
    const skillIdByName = Object.fromEntries(skills.map(s => [s.name, s.id]));
    const courses = await db.prepare('SELECT * FROM courses ORDER BY id').all();
    const jobs = await db.prepare('SELECT * FROM jobs ORDER BY id').all();
    const companies = await db.prepare('SELECT * FROM companies ORDER BY id').all();

    // ===========================
    // EDUCATION + EXPERIENCE + SKILLS + LANGUAGES + PROJECTS for every student
    // ===========================
    const currentYear = 2026;
    let eduAdded = 0, expAdded = 0, skillsAdded = 0, langAdded = 0, projAdded = 0;

    for (const [idx, s] of students.entries()) {
      if (!await count(db, 'SELECT COUNT(*) c FROM educations WHERE student_id = ?', s.id)) {
        const startYear = currentYear - Math.ceil(s.semester / 2);
        await db.prepare(`INSERT INTO educations (student_id, institution, degree, field, start_year, current) VALUES (?, ?, ?, ?, ?, TRUE)`)
          .run(s.id, s.university, 'Pregrado', s.career, startYear);
        eduAdded++;
      }

      if (!await count(db, 'SELECT COUNT(*) c FROM experiences WHERE student_id = ?', s.id) && s.semester >= 5) {
        const t = EXPERIENCE_TEMPLATES[idx % EXPERIENCE_TEMPLATES.length];
        const startDate = `${currentYear - 1}-0${(idx % 6) + 1}`;
        await db.prepare(`INSERT INTO experiences (student_id, company, position, start_date, end_date, current, description) VALUES (?, ?, ?, ?, ?, FALSE, ?)`)
          .run(s.id, t.company, t.role(s.career), startDate, `${currentYear - 1}-12`, t.desc);
        expAdded++;
      }

      if (!await count(db, 'SELECT COUNT(*) c FROM student_skills WHERE student_id = ?', s.id)) {
        const careerSkills = CAREER_SKILLS[s.career] || ['Comunicación Efectiva', 'Trabajo en Equipo', 'Excel'];
        const levels = ['Básico', 'Intermedio', 'Avanzado'];
        const chosen = [...new Set([...careerSkills, 'Inglés', 'Trabajo en Equipo'])];
        for (const [i, name] of chosen.entries()) {
          const skillId = skillIdByName[name];
          if (!skillId) continue;
          await db.prepare(`INSERT INTO student_skills (student_id, skill_id, level) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`)
            .run(s.id, skillId, levels[i % levels.length]);
          skillsAdded++;
        }
      }

      if (!await count(db, 'SELECT COUNT(*) c FROM student_languages WHERE student_id = ?', s.id)) {
        const insertLanguage = db.prepare(`INSERT INTO student_languages (student_id, language, level) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`);
        await insertLanguage.run(s.id, 'Inglés', s.english_level || 'Intermedio');
        langAdded++;
        if (idx % 4 === 0) {
          await insertLanguage.run(s.id, 'Portugués', 'Básico');
          langAdded++;
        }
      }

      const template = PROJECT_TEMPLATES[s.career];
      if (template && !await count(db, 'SELECT COUNT(*) c FROM projects WHERE student_id = ?', s.id)) {
        await db.prepare(`INSERT INTO projects (student_id, name, description, technologies, url) VALUES (?, ?, ?, ?, ?)`)
          .run(s.id, template.name, template.desc, template.tech, '');
        projAdded++;
      }
    }

    // ===========================
    // COURSE MODULES (4 per course)
    // ===========================
    let modulesAdded = 0;
    const moduleTemplates = [
      { suffix: 'Introducción y fundamentos', minutes: 30 },
      { suffix: 'Conceptos y herramientas clave', minutes: 45 },
      { suffix: 'Aplicación a casos reales', minutes: 60 },
      { suffix: 'Proyecto final y evaluación', minutes: 40 },
    ];
    for (const c of courses) {
      if (await count(db, 'SELECT COUNT(*) c FROM course_modules WHERE course_id = ?', c.id)) continue;
      for (const [i, m] of moduleTemplates.entries()) {
        await db.prepare(`INSERT INTO course_modules (course_id, title, description, duration_minutes, order_index) VALUES (?, ?, ?, ?, ?)`)
          .run(c.id, `Módulo ${i + 1}: ${m.suffix}`, `Parte del curso "${c.title}" enfocada en ${m.suffix.toLowerCase()}.`, m.minutes, i + 1);
        modulesAdded++;
      }
    }

    // ===========================
    // MORE ENROLLMENTS (spread across students, not just student #1)
    // ===========================
    let enrollAdded = 0;
    for (const [idx, s] of students.entries()) {
      if (await count(db, 'SELECT COUNT(*) c FROM enrollments WHERE student_id = ?', s.id)) continue;
      const numCourses = 1 + (idx % 3);
      for (let k = 0; k < numCourses; k++) {
        const course = courses[(idx + k * 3) % courses.length];
        const progress = [20, 45, 70, 100][(idx + k) % 4];
        await db.prepare(`INSERT INTO enrollments (student_id, course_id, progress, completed, completed_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING`)
          .run(s.id, course.id, progress, progress === 100, progress === 100 ? '2026-06-15' : null);
        enrollAdded++;
      }
    }

    // ===========================
    // MORE APPLICATIONS (spread across all students)
    // ===========================
    const statuses = ['sent', 'reviewing', 'preselected', 'interview', 'selected', 'rejected'];
    let appsAdded = 0;
    for (const [idx, s] of students.entries()) {
      if (await count(db, 'SELECT COUNT(*) c FROM applications WHERE student_id = ?', s.id) >= 2) continue; // already has applications from seed.js
      const numApps = 2 + (idx % 3);
      for (let k = 0; k < numApps; k++) {
        const job = jobs[(idx * 3 + k) % jobs.length];
        const status = statuses[(idx + k) % statuses.length];
        const daysAgo = 2 + ((idx * 7 + k * 3) % 40);
        const appliedDate = new Date('2026-09-16T00:00:00Z');
        appliedDate.setDate(appliedDate.getDate() - daysAgo);
        const inserted = await db.prepare(`INSERT INTO applications (student_id, job_id, status, applied_at) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING`)
          .run(s.id, job.id, status, appliedDate.toISOString());
        appsAdded += inserted.changes;
      }
    }

    // Recompute applicants_count for every job from real application rows (fixes the random placeholder counts from seed.js)
    await db.prepare(`
      UPDATE jobs j
      SET applicants_count = (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id)
    `).run();

    // ===========================
    // MORE SAVED JOBS (other students besides #1)
    // ===========================
    let savedAdded = 0;
    for (const [idx, s] of students.entries()) {
      if (await count(db, 'SELECT COUNT(*) c FROM saved_jobs WHERE student_id = ?', s.id)) continue;
      const numSaved = 1 + (idx % 3);
      for (let k = 0; k < numSaved; k++) {
        const job = jobs[(idx * 5 + k * 2) % jobs.length];
        const inserted = await db.prepare(`INSERT INTO saved_jobs (student_id, job_id) VALUES (?, ?) ON CONFLICT DO NOTHING`).run(s.id, job.id);
        savedAdded += inserted.changes;
      }
    }

    // ===========================
    // INTERVIEWS (one per application in 'interview' or 'selected' status)
    // ===========================
    let interviewsAdded = 0;
    const interviewApps = await db.prepare(`SELECT id, status, applied_at FROM applications WHERE status IN ('interview', 'selected')`).all();
    for (const app of interviewApps) {
      if (await count(db, 'SELECT COUNT(*) c FROM interviews WHERE application_id = ?', app.id)) continue;
      const scheduled = new Date(`${app.applied_at.replace(' ', 'T')}Z`);
      scheduled.setDate(scheduled.getDate() + 5);
      const status = app.status === 'selected' ? 'completed' : 'scheduled';
      const notes = app.status === 'selected'
        ? 'Entrevista realizada. Candidato/a seleccionado/a para el cargo.'
        : 'Entrevista virtual agendada vía Google Meet. Duración estimada: 45 minutos.';
      await db.prepare(`INSERT INTO interviews (application_id, scheduled_at, notes, status) VALUES (?, ?, ?, ?)`)
        .run(app.id, scheduled.toISOString(), notes, status);
      interviewsAdded++;
    }

    // ===========================
    // FAVORITES (companies + courses saved by students)
    // ===========================
    let favAdded = 0;
    for (const [idx, s] of students.entries()) {
      if (await count(db, 'SELECT COUNT(*) c FROM favorites WHERE student_id = ?', s.id)) continue;
      const insertFavorite = db.prepare(`INSERT INTO favorites (student_id, item_type, item_id) VALUES (?, ?, ?) ON CONFLICT DO NOTHING`);
      if (idx % 2 === 0) {
        await insertFavorite.run(s.id, 'company', companies[idx % companies.length].id);
        favAdded++;
      }
      if (idx % 3 === 0) {
        await insertFavorite.run(s.id, 'course', courses[idx % courses.length].id);
        favAdded++;
      }
    }

    // ===========================
    // NOTIFICATIONS for companies (new applications received) + more students
    // ===========================
    let notifAdded = 0;
    const companyUsers = await db.prepare(`SELECT c.id as company_id, c.name, u.id as user_id FROM companies c JOIN users u ON u.id = c.user_id`).all();
    for (const cu of companyUsers) {
      if (await count(db, 'SELECT COUNT(*) c FROM notifications WHERE user_id = ?', cu.user_id)) continue;
      const pending = await count(db, `SELECT COUNT(*) c FROM applications a JOIN jobs j ON j.id = a.job_id WHERE j.company_id = ? AND a.status = 'sent'`, cu.company_id);
      await db.prepare(`INSERT INTO notifications (user_id, title, message, type, read) VALUES (?, ?, ?, 'info', FALSE)`)
        .run(cu.user_id, 'Nuevas postulaciones recibidas', `Tienes ${pending} postulación(es) sin revisar en tus vacantes publicadas.`);
      notifAdded++;
    }

    const studentUsers = await db.prepare(`SELECT s.id as student_id, u.id as user_id FROM students s JOIN users u ON u.id = s.user_id`).all();
    for (const su of studentUsers) {
      if (await count(db, 'SELECT COUNT(*) c FROM notifications WHERE user_id = ?', su.user_id)) continue;
      await db.prepare(`INSERT INTO notifications (user_id, title, message, type, read) VALUES (?, ?, ?, 'success', FALSE)`)
        .run(su.user_id, '¡Bienvenido a UniEmpleo!', 'Tu cuenta ha sido creada exitosamente. Completa tu perfil para obtener mejores recomendaciones.');
      notifAdded++;
    }

    console.log('✅ Enriquecimiento completado:');
    console.log(`   Educación: +${eduAdded}  Experiencia: +${expAdded}  Skills: +${skillsAdded}  Idiomas: +${langAdded}  Proyectos: +${projAdded}`);
    console.log(`   Módulos de curso: +${modulesAdded}  Inscripciones: +${enrollAdded}`);
    console.log(`   Postulaciones: +${appsAdded}  Guardados: +${savedAdded}`);
    console.log(`   Entrevistas: +${interviewsAdded}  Favoritos: +${favAdded}  Notificaciones: +${notifAdded}`);
  });
}

module.exports = { enrichDatabase };

if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
  enrichDatabase()
    .catch((err) => {
      console.error(err);
      process.exitCode = 1;
    })
    .finally(closeDatabase);
}
