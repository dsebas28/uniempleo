// Prueba de punta a punta de la API contra el backend en marcha y su base PostgreSQL.
// Recorre todas las rutas con los tres roles de la demo.
//   1) npm run dev            (en otra terminal)
//   2) npm test               (API_URL permite apuntar a otro servidor)
// Crea un estudiante y una empresa nuevos en cada ejecución (correos con marca de tiempo).
const { test } = require('node:test');
const assert = require('node:assert/strict');

const API = process.env.API_URL || 'http://localhost:5000/api';
const stamp = Date.now();

async function call(method, path, { token, body, expect = 200 } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  assert.equal(res.status, expect, `${method} ${path} -> ${res.status} ${JSON.stringify(data)}`);
  return data;
}

const login = async (email, password) => (await call('POST', '/auth/login', { body: { email, password } })).token;

test('rutas públicas', async () => {
  const health = await call('GET', '/health');
  assert.equal(health.status, 'ok');

  const stats = await call('GET', '/jobs/stats');
  for (const key of ['students', 'companies', 'jobs', 'hired']) assert.equal(typeof stats[key], 'number');

  const page = await call('GET', '/jobs?limit=5');
  assert.equal(page.jobs.length, 5);
  assert.ok(page.total >= page.jobs.length);

  // ILIKE: la búsqueda no distingue mayúsculas
  const upper = await call('GET', '/jobs?keyword=DESARROLLADOR');
  const lower = await call('GET', '/jobs?keyword=desarrollador');
  assert.ok(upper.total > 0);
  assert.equal(upper.total, lower.total);

  const internships = await call('GET', '/jobs?isInternship=true');
  assert.ok(internships.jobs.every((j) => j.is_internship === 1));

  const job = await call('GET', `/jobs/${page.jobs[0].id}`);
  assert.ok(job.company_name);
  assert.match(job.created_at, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
  await call('GET', '/jobs/999999', { expect: 404 });

  const companies = await call('GET', '/companies');
  assert.ok(companies.every((c) => c.approved === 1 && typeof c.job_count === 'number'));
  const company = await call('GET', `/companies/${companies[0].id}`);
  assert.ok(Array.isArray(company.jobs));

  const courses = await call('GET', '/courses');
  const course = await call('GET', `/courses/${courses[0].id}`);
  assert.equal(course.modules.length, 4);
  assert.equal(typeof course.rating, 'number');
});

test('autenticación y permisos', async () => {
  await call('POST', '/auth/login', { body: { email: 'estudiante@demo.com', password: 'mal' }, expect: 401 });
  await call('GET', '/student/profile', { expect: 401 });
  const token = await login('estudiante@demo.com', 'demo1234');
  await call('GET', '/admin/dashboard', { token, expect: 403 });
  const me = await call('GET', '/auth/me', { token });
  assert.equal(me.role, 'student');
});

test('registro de estudiante y empresa', async () => {
  const student = await call('POST', '/auth/register/student', {
    expect: 201,
    body: { email: `nuevo.${stamp}@demo.com`, password: 'demo1234', fullName: 'Estudiante Nuevo', university: 'U. Prueba', career: 'Ingeniería', semester: 3, city: 'Bogotá' },
  });
  const profile = await call('GET', '/student/profile', { token: student.token });
  assert.equal(profile.full_name, 'Estudiante Nuevo');

  await call('POST', '/auth/register/student', {
    expect: 400,
    body: { email: `nuevo.${stamp}@demo.com`, password: 'demo1234', fullName: 'Duplicado' },
  });

  const company = await call('POST', '/auth/register/company', {
    expect: 201,
    body: { email: `empresa.${stamp}@demo.com`, password: 'demo1234', name: 'Empresa Prueba', nit: '900000000-1', city: 'Cali', sector: 'Tecnología' },
  });
  const companyProfile = await call('GET', '/companies/me/profile', { token: company.token });
  assert.equal(companyProfile.name, 'Empresa Prueba');
});

test('flujo del estudiante', async () => {
  const token = await login('estudiante@demo.com', 'demo1234');

  // El panel del estudiante lee kpis, appsByMonth, appsByStatus y recommended
  const dashboard = await call('GET', '/student/dashboard', { token });
  assert.ok(dashboard.kpis.totalApps > 0);
  assert.match(dashboard.appsByMonth[0].month, /^\d{4}-\d{2}$/);
  assert.ok(dashboard.appsByStatus.length > 0 && dashboard.recommended.length > 0);

  const updated = await call('PUT', '/student/profile', {
    token,
    body: { headline: 'Desarrollador en formación', birthDate: '', availableTravel: true, skills: ['JavaScript', 'React', 'PostgreSQL'] },
  });
  assert.equal(updated.profile.available_travel, 1);
  assert.equal(updated.profile.birth_date, null);
  assert.ok(updated.profile.skills.some((s) => s.name === 'PostgreSQL'));

  const withBirth = await call('PUT', '/student/profile', { token, body: { birthDate: '2003-05-20' } });
  assert.equal(withBirth.profile.birth_date, '2003-05-20');

  const edu = await call('POST', '/student/educations', { token, expect: 201, body: { institution: 'SENA', degree: 'Técnico', startYear: 2019, endYear: 2020 } });
  const eduId = edu.profile.educations.find((e) => e.institution === 'SENA').id;
  await call('PUT', `/student/educations/${eduId}`, { token, body: { institution: 'SENA', degree: 'Tecnólogo', startYear: 2019, endYear: 2021 } });
  await call('DELETE', `/student/educations/${eduId}`, { token });

  const exp = await call('POST', '/student/experiences', { token, expect: 201, body: { company: 'Prueba SAS', position: 'Practicante', startDate: '2025-02', current: true } });
  const expId = exp.profile.experiences.find((e) => e.company === 'Prueba SAS').id;
  await call('PUT', `/student/experiences/${expId}`, { token, body: { company: 'Prueba SAS', position: 'Analista', startDate: '2025-02', endDate: '2025-12' } });
  await call('DELETE', `/student/experiences/${expId}`, { token });

  const lang = await call('POST', '/student/languages', { token, expect: 201, body: { language: 'Francés', level: 'Básico' } });
  const langId = lang.profile.languages.find((l) => l.language === 'Francés').id;
  await call('PUT', `/student/languages/${langId}`, { token, body: { language: 'Francés', level: 'Intermedio' } });
  await call('DELETE', `/student/languages/${langId}`, { token });

  const { jobs } = await call('GET', '/jobs?limit=30');
  const applied = new Set((await call('GET', '/student/applications', { token })).map((a) => a.job_id));
  const target = jobs.find((j) => !applied.has(j.id));
  await call('POST', `/student/jobs/${target.id}/apply`, { token, expect: 201, body: { coverLetter: 'Me interesa mucho.' } });
  await call('POST', `/applications/jobs/${target.id}`, { token, expect: 400, body: {} }); // ya postulado

  await call('POST', `/student/saved-jobs/${target.id}`, { token });
  await call('POST', `/student/saved-jobs/${target.id}`, { token }); // idempotente
  assert.ok((await call('GET', '/student/saved-jobs', { token })).some((j) => j.id === target.id));
  await call('DELETE', `/student/saved-jobs/${target.id}`, { token });

  const alert = await call('POST', '/student/job-alerts', { token, expect: 201, body: { area: 'Tecnología' } });
  await call('PUT', `/student/job-alerts/${alert.id}`, { token, body: { active: false } });
  assert.equal((await call('GET', '/student/job-alerts', { token })).find((a) => a.id === alert.id).active, 0);
  await call('DELETE', `/student/job-alerts/${alert.id}`, { token });
  await call('POST', '/student/job-alerts', { token, expect: 400, body: {} });

  assert.ok(Array.isArray(await call('GET', '/applications/student', { token })));
  assert.ok(Array.isArray(await call('GET', '/courses/my-enrollments', { token })));
  const courses = await call('GET', '/courses');
  await call('POST', `/courses/${courses[courses.length - 1].id}/enroll`, { token });

  const notifs = await call('GET', '/notifications', { token });
  assert.equal(typeof notifs.unread, 'number');
  if (notifs.notifications.length) await call('PUT', `/notifications/${notifs.notifications[0].id}/read`, { token });
  await call('PUT', '/notifications/read-all', { token });
  assert.equal((await call('GET', '/notifications', { token })).unread, 0);
});

test('flujo de la empresa', async () => {
  const token = await login('empresa@demo.com', 'demo1234');

  const dashboard = await call('GET', '/companies/me/dashboard', { token });
  for (const key of ['activeJobs', 'totalApps', 'reviewing', 'selected', 'interviews', 'candidates']) assert.equal(typeof dashboard.kpis[key], 'number');
  assert.ok(dashboard.kpis.totalApps > 0 && dashboard.appsByStatus.length > 0);
  assert.ok(dashboard.recentApplications.every((a) => a.student_name && a.job_title));

  const profile = await call('GET', '/companies/me/profile', { token });
  await call('PUT', '/companies/me/profile', { token, body: { ...profile, mission: profile.mission } });

  const created = await call('POST', '/companies/me/jobs', {
    token,
    expect: 201,
    body: { title: 'Vacante de prueba', description: 'Descripción', city: 'Bogotá', modality: 'Remoto', contractType: 'Tiempo completo', area: 'Tecnología', salaryMin: 1000000, salaryMax: 2000000, isInternship: true, deadline: '' },
  });
  const mine = await call('GET', '/companies/me/jobs', { token });
  const job = mine.find((j) => j.id === created.id);
  assert.equal(job.is_internship, 1);
  assert.equal(job.deadline, null);

  await call('PUT', `/companies/me/jobs/${created.id}`, {
    token,
    body: { title: 'Vacante de prueba (editada)', description: 'Descripción', city: 'Bogotá', modality: 'Híbrido', contractType: 'Tiempo completo', area: 'Tecnología', status: 'paused', deadline: '2026-12-31' },
  });
  // CHECK de la base: el salario mínimo no puede superar al máximo
  await call('POST', '/companies/me/jobs', {
    token,
    expect: 400,
    body: { title: 'Rango inválido', description: 'x', city: 'Bogotá', modality: 'Remoto', contractType: 'Tiempo completo', area: 'Tecnología', salaryMin: 3000000, salaryMax: 1000000 },
  });
  await call('DELETE', `/companies/me/jobs/${created.id}`, { token });

  const candidates = await call('GET', '/companies/me/candidates', { token });
  assert.ok(candidates.length > 0);
  assert.ok(Array.isArray(candidates[0].skills) && Array.isArray(candidates[0].educations));
  const appId = candidates[0].id;
  await call('PUT', `/companies/me/candidates/${appId}/status`, { token, body: { status: 'reviewing', message: 'Gracias por postularte.' } });
  await call('PUT', `/applications/${appId}/status`, { token, body: { status: 'interview' } });
  await call('PUT', `/applications/${appId}/status`, { token, expect: 400, body: { status: 'inventado' } });
  await call('POST', `/companies/me/candidates/${appId}/message`, { token, body: { message: 'Te escribiremos pronto.' } });
  assert.ok(Array.isArray(await call('GET', '/applications/company', { token })));
});

test('panel de administración', async () => {
  const token = await login('admin@uniempleo.com', 'admin1234');

  const dashboard = await call('GET', '/admin/dashboard', { token });
  assert.ok(dashboard.kpis.students > 0 && dashboard.kpis.jobs >= dashboard.kpis.activeJobs);

  const users = await call('GET', '/admin/users?role=student&limit=5', { token });
  assert.equal(users.users.length, 5);
  const target = users.users.find((u) => u.email !== 'estudiante@demo.com');
  await call('PUT', `/admin/users/${target.id}`, { token, body: { active: false } });
  await call('PUT', `/admin/users/${target.id}`, { token, body: { active: true } });

  const companies = await call('GET', '/admin/companies', { token });
  await call('PUT', `/admin/companies/${companies[0].id}`, { token, body: { approved: true } });

  const jobs = await call('GET', '/admin/jobs', { token });
  await call('PUT', `/admin/jobs/${jobs[0].id}`, { token, body: { status: jobs[0].status } });

  const reports = await call('GET', '/admin/reports', { token });
  assert.match(reports.userGrowth[0].month, /^\d{4}-\d{2}$/);

  const emails = await call('GET', '/admin/email-log', { token });
  assert.equal(typeof emails.total, 'number');
});
