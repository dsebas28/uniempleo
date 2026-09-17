const bcrypt = require('bcryptjs');
const { getDb } = require('../database/db');

async function seedDatabase() {
  const db = getDb();

  // Check if already seeded
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (userCount.count > 0) {
    console.log('✅ Database already seeded');
    return;
  }

  console.log('🌱 Seeding database...');

  const hashPassword = async (pwd) => bcrypt.hash(pwd, 10);

  // ===========================
  // ADMIN USER
  // ===========================
  const adminPassword = await hashPassword('admin1234');
  const adminUser = db.prepare(`INSERT INTO users (email, password, role) VALUES (?, ?, 'admin')`).run('admin@uniempleo.com', adminPassword);
  db.prepare(`INSERT INTO admin_users (user_id, full_name) VALUES (?, ?)`).run(adminUser.lastInsertRowid, 'Admin UniEmpleo');

  // ===========================
  // COMPANIES (10)
  // ===========================
  const companyPassword = await hashPassword('demo1234');
  const companiesData = [
    { email: 'empresa@demo.com',         name: 'TechCo SAS',              nit: '900123456-1', city: 'Bogotá',       sector: 'Tecnología',        description: 'Empresa líder en desarrollo de software y soluciones tecnológicas para el mercado latinoamericano.', mission: 'Transformar digitalmente las empresas de la región con tecnología de vanguardia.' },
    { email: 'datacorp@demo.com',         name: 'DataCorp Colombia',        nit: '900234567-2', city: 'Medellín',     sector: 'Análisis de Datos', description: 'Especialistas en inteligencia de negocios, big data y analítica avanzada.', mission: 'Convertir datos en decisiones estratégicas para nuestros clientes.' },
    { email: 'innovatech@demo.com',       name: 'InnovaTech Digital',       nit: '900345678-3', city: 'Cali',         sector: 'Marketing Digital', description: 'Agencia de marketing digital full-service con presencia en toda Colombia.', mission: 'Potenciar las marcas de nuestros clientes en el mundo digital.' },
    { email: 'greenlogistics@demo.com',   name: 'Green Logistics SAS',      nit: '900456789-4', city: 'Barranquilla', sector: 'Logística',         description: 'Empresa de logística sostenible con flota eléctrica y gestión ambiental responsable.', mission: 'Mover el comercio colombiano de manera eficiente y sostenible.' },
    { email: 'fintech@demo.com',          name: 'FinTech Solutions',         nit: '900567890-5', city: 'Bogotá',       sector: 'Finanzas',          description: 'Startup fintech revolucionando los pagos digitales y servicios financieros en Colombia.', mission: 'Democratizar el acceso a servicios financieros digitales.' },
    { email: 'healthai@demo.com',         name: 'HealthAI Colombia',         nit: '900678901-6', city: 'Medellín',     sector: 'Salud y Tecnología', description: 'Empresa de tecnología médica que usa inteligencia artificial para diagnósticos más precisos.', mission: 'Mejorar la calidad de vida de los colombianos a través de la tecnología médica.' },
    { email: 'eduplus@demo.com',          name: 'EduPlus Latam',             nit: '900789012-7', city: 'Bogotá',       sector: 'Educación',         description: 'Plataforma educativa online con más de 500,000 estudiantes en América Latina.', mission: 'Hacer la educación de calidad accesible para todos en Latam.' },
    { email: 'construcciones@demo.com',   name: 'Construcciones Modernas',   nit: '900890123-8', city: 'Cali',         sector: 'Construcción',      description: 'Empresa constructora especializada en proyectos sostenibles y arquitectura moderna.', mission: 'Construir el futuro de Colombia con innovación y sostenibilidad.' },
    { email: 'agrocol@demo.com',          name: 'AgroCol Tech',              nit: '900901234-9', city: 'Bucaramanga',  sector: 'Agroindustria',     description: 'Empresa de tecnología agrícola que optimiza la producción de cultivos con IoT y IA.', mission: 'Revolucionar la agricultura colombiana con tecnología inteligente.' },
    { email: 'creativa@demo.com',         name: 'Creativa Studio',           nit: '901012345-0', city: 'Bogotá',       sector: 'Diseño y Creatividad', description: 'Estudio creativo de diseño gráfico, UX/UI y producción audiovisual.', mission: 'Crear experiencias visuales que conecten marcas con personas.' },
  ];

  const companyIds = [];
  for (const c of companiesData) {
    const u = db.prepare(`INSERT INTO users (email, password, role) VALUES (?, ?, 'company')`).run(c.email, companyPassword);
    const co = db.prepare(`INSERT INTO companies (user_id, name, nit, phone, city, sector, description, mission, approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`)
      .run(u.lastInsertRowid, c.name, c.nit, '601' + Math.floor(Math.random() * 9000000 + 1000000), c.city, c.sector, c.description, c.mission);
    companyIds.push(co.lastInsertRowid);
  }

  // ===========================
  // STUDENTS (20)
  // ===========================
  const studentPassword = await hashPassword('demo1234');
  const studentsData = [
    { email: 'estudiante@demo.com',       name: 'Carlos Andrés Martínez',    uni: 'Universidad Nacional de Colombia',    career: 'Ingeniería de Sistemas',    sem: 8, city: 'Bogotá',       about: 'Estudiante apasionado por el desarrollo web y la inteligencia artificial. Busco mi primera experiencia profesional en tecnología.' },
    { email: 'ana.garcia@demo.com',       name: 'Ana María García Ruiz',     uni: 'Universidad de los Andes',            career: 'Administración de Empresas', sem: 6, city: 'Bogotá',       about: 'Me interesa el mundo empresarial y la gestión de proyectos. Con habilidades en análisis financiero.' },
    { email: 'juan.lopez@demo.com',       name: 'Juan Pablo López Herrera',  uni: 'Universidad de Antioquia',            career: 'Ingeniería Industrial',      sem: 7, city: 'Medellín',     about: 'Ingeniero industrial en formación, experto en optimización de procesos y gestión de calidad.' },
    { email: 'maria.torres@demo.com',     name: 'María Fernanda Torres',     uni: 'Universidad del Valle',               career: 'Diseño Gráfico',             sem: 5, city: 'Cali',         about: 'Diseñadora gráfica con pasión por el UI/UX y la identidad de marca. Domino Adobe Creative Suite.' },
    { email: 'diego.ramirez@demo.com',    name: 'Diego Alejandro Ramírez',   uni: 'Universidad EAFIT',                   career: 'Ingeniería Informática',     sem: 9, city: 'Medellín',     about: 'Casi graduado de informática con experiencia en proyectos universitarios de desarrollo de apps.' },
    { email: 'valentina.reyes@demo.com',  name: 'Valentina Reyes Castro',    uni: 'Universidad Javeriana',               career: 'Psicología',                 sem: 6, city: 'Bogotá',       about: 'Psicóloga en formación con enfoque en psicología organizacional y gestión del talento humano.' },
    { email: 'andrés.mora@demo.com',      name: 'Andrés Felipe Mora',        uni: 'Universidad Nacional de Colombia',    career: 'Estadística',                sem: 7, city: 'Bogotá',       about: 'Estadístico en formación con habilidades en Python, R y análisis de datos masivos.' },
    { email: 'sofia.vasquez@demo.com',    name: 'Sofía Vásquez Mendoza',     uni: 'Universidad del Norte',               career: 'Comunicación Social',        sem: 5, city: 'Barranquilla', about: 'Comunicadora social con habilidades en redacción, community management y marketing de contenidos.' },
    { email: 'camilo.ospina@demo.com',    name: 'Camilo Ospina Jiménez',     uni: 'Universidad Pontificia Bolivariana',  career: 'Ingeniería Civil',           sem: 8, city: 'Medellín',     about: 'Ingeniero civil con experiencia en proyectos de construcción sostenible y gestión ambiental.' },
    { email: 'laura.silva@demo.com',      name: 'Laura Daniela Silva',       uni: 'Universidad de la Sabana',            career: 'Contaduría Pública',         sem: 6, city: 'Bogotá',       about: 'Contadora en formación con conocimientos en NIIF, tributaria y gestión financiera empresarial.' },
    { email: 'miguel.perez@demo.com',     name: 'Miguel Ángel Pérez',        uni: 'Universidad Tecnológica de Pereira',  career: 'Ingeniería Mecatrónica',     sem: 7, city: 'Pereira',      about: 'Apasionado por la robótica, automatización y el Internet de las Cosas (IoT).' },
    { email: 'isabella.gomez@demo.com',   name: 'Isabella Gómez Rivera',     uni: 'Universidad Externado',               career: 'Derecho',                    sem: 8, city: 'Bogotá',       about: 'Estudiante de derecho con énfasis en derecho corporativo y contratación pública.' },
    { email: 'sebastian.nunez@demo.com',  name: 'Sebastián Núñez Pinto',     uni: 'Universidad Distrital',               career: 'Ingeniería Electrónica',     sem: 6, city: 'Bogotá',       about: 'Electrónico en formación con proyectos en sistemas embebidos y telecomunicaciones.' },
    { email: 'daniela.castro@demo.com',   name: 'Daniela Castro Guerrero',   uni: 'Universidad CES',                     career: 'Medicina',                   sem: 9, city: 'Medellín',     about: 'Médica en formación con interés en salud digital y telemedicina.' },
    { email: 'felipe.arango@demo.com',    name: 'Felipe Arango Salazar',     uni: 'Universidad de Caldas',               career: 'Administración de Negocios', sem: 5, city: 'Manizales',    about: 'Emprendedor nato, con proyectos de negocios propios y pasión por las startups.' },
    { email: 'natalia.vargas@demo.com',   name: 'Natalia Vargas Duque',      uni: 'Universidad Surcolombiana',           career: 'Ingeniería Ambiental',       sem: 7, city: 'Neiva',        about: 'Ambientalista comprometida con el desarrollo sostenible y la gestión de residuos.' },
    { email: 'julian.mendez@demo.com',    name: 'Julián Méndez Cano',        uni: 'Universidad del Quindío',             career: 'Música',                     sem: 4, city: 'Armenia',      about: 'Músico y productor musical con habilidades en edición de audio y composición digital.' },
    { email: 'sara.bermudez@demo.com',    name: 'Sara Bermúdez Ríos',        uni: 'Universidad de Córdoba',              career: 'Agronomía',                  sem: 6, city: 'Montería',     about: 'Agrónoma enfocada en agricultura sostenible y uso eficiente de recursos naturales.' },
    { email: 'daniel.cano@demo.com',      name: 'Daniel Cano Mejía',         uni: 'Universidad Autónoma de Manizales',   career: 'Fisioterapia',               sem: 8, city: 'Manizales',    about: 'Fisioterapeuta en formación con interés en rehabilitación deportiva y ergonomía.' },
    { email: 'paula.escobar@demo.com',    name: 'Paula Andrea Escobar',      uni: 'Universidad de Nariño',               career: 'Nutrición y Dietética',      sem: 5, city: 'Pasto',        about: 'Nutricionista con interés en nutrición clínica y educación alimentaria comunitaria.' },
  ];

  const englishLevels = ['Básico', 'Pre-intermedio', 'Intermedio', 'Intermedio-alto', 'Avanzado'];
  const modalities = ['Remoto', 'Híbrido', 'Presencial'];
  const availabilities = ['Inmediata', '1 mes', '2 meses', '3 meses'];

  const studentIds = [];
  for (let i = 0; i < studentsData.length; i++) {
    const s = studentsData[i];
    const u = db.prepare(`INSERT INTO users (email, password, role) VALUES (?, ?, 'student')`).run(s.email, studentPassword);
    const completion = 40 + Math.floor(Math.random() * 55);
    const st = db.prepare(`INSERT INTO students (user_id, full_name, university, career, semester, city, about_me, english_level, preferred_modality, availability, profile_completion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(u.lastInsertRowid, s.name, s.uni, s.career, s.sem, s.city, s.about,
        englishLevels[i % englishLevels.length],
        modalities[i % modalities.length],
        availabilities[i % availabilities.length],
        completion);
    studentIds.push(st.lastInsertRowid);
  }

  // ===========================
  // SKILLS
  // ===========================
  const skillsData = [
    { name: 'JavaScript', category: 'Programación' },
    { name: 'Python', category: 'Programación' },
    { name: 'React', category: 'Programación' },
    { name: 'Node.js', category: 'Programación' },
    { name: 'SQL', category: 'Datos' },
    { name: 'Excel', category: 'Herramientas' },
    { name: 'Power BI', category: 'Datos' },
    { name: 'Tableau', category: 'Datos' },
    { name: 'Photoshop', category: 'Diseño' },
    { name: 'Illustrator', category: 'Diseño' },
    { name: 'Figma', category: 'Diseño' },
    { name: 'AutoCAD', category: 'Ingeniería' },
    { name: 'MATLAB', category: 'Ingeniería' },
    { name: 'Marketing Digital', category: 'Marketing' },
    { name: 'SEO/SEM', category: 'Marketing' },
    { name: 'Gestión de Proyectos', category: 'Gestión' },
    { name: 'Contabilidad', category: 'Finanzas' },
    { name: 'Inglés', category: 'Idiomas' },
    { name: 'Comunicación Efectiva', category: 'Soft Skills' },
    { name: 'Trabajo en Equipo', category: 'Soft Skills' },
  ];

  const skillIds = [];
  for (const sk of skillsData) {
    const r = db.prepare(`INSERT OR IGNORE INTO skills (name, category) VALUES (?, ?)`).run(sk.name, sk.category);
    const sid = db.prepare(`SELECT id FROM skills WHERE name = ?`).get(sk.name);
    skillIds.push(sid.id);
  }

  // Assign skills to first student (demo user)
  const demoSkills = [0, 1, 2, 3, 4, 5];
  for (const si of demoSkills) {
    db.prepare(`INSERT OR IGNORE INTO student_skills (student_id, skill_id, level) VALUES (?, ?, ?)`)
      .run(studentIds[0], skillIds[si], 'Intermedio');
  }

  // ===========================
  // JOBS (30)
  // ===========================
  const jobsData = [
    // TechCo SAS - companyIds[0]
    { cIdx: 0, title: 'Desarrollador Frontend Junior', desc: 'Buscamos un desarrollador frontend entusiasta para unirse a nuestro equipo de productos digitales. Trabajarás con tecnologías modernas como React y construirás interfaces de usuario increíbles.', responsibilities: 'Desarrollar componentes React reutilizables\nColaborar con el equipo de diseño UX/UI\nOptimizar el rendimiento de aplicaciones web\nEscribir código limpio y documentado', requirements: 'Estudiante o recién graduado en Ingeniería de Sistemas o afines\nConocimientos básicos de React o Vue.js\nManejo de HTML, CSS, JavaScript\nGanas de aprender y crecer profesionalmente', skills: 'JavaScript,React,HTML,CSS,Git', benefits: 'Trabajo 100% remoto\nFlexibilidad de horario\nMentoría de desarrolladores senior\nComputador portátil proporcionado', salary_min: 1500000, salary_max: 2500000, city: 'Bogotá', modality: 'Remoto', contract: 'Tiempo completo', exp: 0, area: 'Tecnología', is_int: 0, no_exp: 1 },
    { cIdx: 0, title: 'Pasante de QA Testing', desc: 'Práctica profesional en el área de calidad de software. Aprenderás metodologías de testing ágil y trabajarás con herramientas de automatización de pruebas.', responsibilities: 'Ejecutar casos de prueba manuales\nReportar y documentar bugs\nAprender Selenium y Cypress\nColaborar con el equipo de desarrollo', requirements: 'Estudiante de Ingeniería de Sistemas, Software o afines\nConocimientos básicos de programación\nAtención al detalle\nDisponibilidad de 6 meses', skills: 'SQL,JavaScript,Excel', benefits: 'Auxilio de transporte\nBono de alimentación\nCertificado de práctica\nPosibilidad de vinculación', salary_min: 800000, salary_max: 1200000, city: 'Bogotá', modality: 'Híbrido', contract: 'Contrato de aprendizaje', exp: 0, area: 'Tecnología', is_int: 1, no_exp: 1 },
    { cIdx: 0, title: 'Desarrollador Backend Node.js', desc: 'Únete a nuestro equipo de backend para construir APIs robustas y escalables que potencian nuestros productos.', responsibilities: 'Diseñar e implementar APIs REST\nOptimizar consultas de base de datos\nImplementar autenticación y seguridad\nParticipación en arquitectura del sistema', requirements: 'Conocimientos de Node.js y Express\nExperiencia con bases de datos SQL y NoSQL\nConocimiento de Git\nNivel de inglés intermedio', skills: 'Node.js,SQL,JavaScript,Git', benefits: 'Salario competitivo\nSeguros médicos\nBonificaciones por rendimiento\nTrabajo remoto', salary_min: 2000000, salary_max: 3500000, city: 'Bogotá', modality: 'Remoto', contract: 'Tiempo completo', exp: 1, area: 'Tecnología', is_int: 0, no_exp: 0 },

    // DataCorp - companyIds[1]
    { cIdx: 1, title: 'Analista de Datos Junior', desc: 'Buscamos un analista de datos apasionado por transformar datos en insights valiosos para el negocio.', responsibilities: 'Analizar grandes volúmenes de datos\nCrear dashboards en Power BI\nElaborar informes ejecutivos\nLimpiar y procesar datasets', requirements: 'Estudiante o graduado en Estadística, Matemáticas, Ingeniería o afines\nManejo de Excel avanzado\nConocimientos básicos de SQL\nHabilidades analíticas', skills: 'Excel,Power BI,SQL,Python', benefits: 'Capacitación continua\nAcceso a herramientas premium de datos\nHorario flexible\nBonus por desempeño', salary_min: 1800000, salary_max: 2800000, city: 'Medellín', modality: 'Híbrido', contract: 'Tiempo completo', exp: 0, area: 'Datos e IA', is_int: 0, no_exp: 1 },
    { cIdx: 1, title: 'Científico de Datos en Práctica', desc: 'Práctica profesional en ciencia de datos. Trabajarás con modelos de machine learning reales y datos de producción.', responsibilities: 'Desarrollar modelos predictivos\nTrabajar con Python y sus librerías de ML\nVisualizar resultados con Matplotlib y Seaborn\nDocumentar modelos y hallazgos', requirements: 'Estudiante de últimos semestres de Estadística, Sistemas o Matemáticas\nConocimientos de Python\nConceptos básicos de machine learning\nDisponibilidad de 6 meses', skills: 'Python,SQL,Excel,Tableau', benefits: 'Auxilio de práctica\nAcceso a plataformas de datos\nMentoring personalizado\nCertificado de práctica', salary_min: 900000, salary_max: 1300000, city: 'Medellín', modality: 'Presencial', contract: 'Contrato de aprendizaje', exp: 0, area: 'Datos e IA', is_int: 1, no_exp: 1 },

    // InnovaTech - companyIds[2]
    { cIdx: 2, title: 'Community Manager Junior', desc: 'Únete a nuestro equipo creativo para gestionar las redes sociales de marcas líderes en Colombia.', responsibilities: 'Crear contenido para redes sociales\nGestionar comunidades online\nAnalizar métricas de engagement\nProponer estrategias de contenido', requirements: 'Estudiante de Comunicación, Marketing, Publicidad o afines\nCreatividad y habilidades de redacción\nConocimiento de redes sociales\nPortafolio deseable', skills: 'Marketing Digital,SEO/SEM,Comunicación Efectiva', benefits: 'Ambiente creativo\nCapacitaciones en marketing digital\nFlexibilidad de horario\nTrabajo desde casa', salary_min: 1200000, salary_max: 1800000, city: 'Cali', modality: 'Remoto', contract: 'Medio tiempo', exp: 0, area: 'Marketing', is_int: 0, no_exp: 1 },
    { cIdx: 2, title: 'Diseñador UX/UI en Práctica', desc: 'Práctica profesional en diseño de experiencia de usuario para apps y plataformas web.', responsibilities: 'Diseñar wireframes y prototipos en Figma\nConducir investigación con usuarios\nColaborar con el equipo de desarrollo\nIterar diseños basados en feedback', requirements: 'Estudiante de Diseño Gráfico, Diseño Industrial o afines\nConocimientos de Figma o Adobe XD\nPortafolio de proyectos\nPensamiento centrado en el usuario', skills: 'Figma,Photoshop,Illustrator', benefits: 'Mentoring de diseñadores senior\nAcceso a herramientas de diseño\nHorario flexible\nCertificado de práctica', salary_min: 850000, salary_max: 1200000, city: 'Cali', modality: 'Híbrido', contract: 'Contrato de aprendizaje', exp: 0, area: 'Diseño', is_int: 1, no_exp: 1 },
    { cIdx: 2, title: 'Especialista SEO', desc: 'Optimiza el posicionamiento web de nuestros clientes con estrategias SEO efectivas y medibles.', responsibilities: 'Auditorías SEO de sitios web\nOptimización de contenido on-page\nEstrategias de link building\nAnálisis de competencia', requirements: 'Conocimientos de SEO técnico y on-page\nManejo de Google Analytics\nHabilidades analíticas\nExperiencia mínima deseable', skills: 'SEO/SEM,Marketing Digital,Excel', benefits: 'Comisiones por resultados\nCapacitaciones pagadas\nAcceso a herramientas premium\nTrabajo remoto', salary_min: 1500000, salary_max: 2500000, city: 'Cali', modality: 'Remoto', contract: 'Freelance', exp: 1, area: 'Marketing', is_int: 0, no_exp: 0 },

    // Green Logistics - companyIds[3]
    { cIdx: 3, title: 'Asistente de Logística', desc: 'Apoya la coordinación de rutas de transporte y gestión de inventarios en nuestra red de distribución.', responsibilities: 'Coordinar rutas de entrega\nGestionar inventarios en sistema\nAtender proveedores y transportadores\nElaborar informes de gestión', requirements: 'Estudiante de Ingeniería Industrial, Logística o afines\nConocimientos básicos de logística\nManejo de Excel\nBuenas habilidades comunicativas', skills: 'Excel,Gestión de Proyectos,Comunicación Efectiva', benefits: 'Subsidio de transporte\nSeguro de vida\nCafetería\nCapacitaciones gratuitas', salary_min: 1300000, salary_max: 1900000, city: 'Barranquilla', modality: 'Presencial', contract: 'Tiempo completo', exp: 0, area: 'Logística', is_int: 0, no_exp: 1 },
    { cIdx: 3, title: 'Pasante de Ingeniería Industrial', desc: 'Práctica profesional en optimización de procesos logísticos y gestión de la cadena de suministro.', responsibilities: 'Analizar procesos de distribución\nImplementar mejoras con Lean\nElaborar estudios de tiempo y movimiento\nProponer soluciones de optimización', requirements: 'Estudiante de últimos semestres de Ingeniería Industrial\nConocimientos de Lean Manufacturing\nManejo de Excel avanzado\nDisponibilidad de 6 meses', skills: 'Excel,AutoCAD,Gestión de Proyectos', benefits: 'Auxilio de transporte\nAlmuerzo incluido\nCertificado de práctica\nPosible vinculación', salary_min: 900000, salary_max: 1100000, city: 'Barranquilla', modality: 'Presencial', contract: 'Contrato de aprendizaje', exp: 0, area: 'Ingeniería', is_int: 1, no_exp: 1 },

    // FinTech - companyIds[4]
    { cIdx: 4, title: 'Analista Financiero Junior', desc: 'Forma parte de nuestro equipo de finanzas y ayúdanos a construir el futuro de los pagos digitales en Colombia.', responsibilities: 'Analizar estados financieros\nElaborar modelos financieros\nPreparar reportes para dirección\nMonitorear indicadores clave', requirements: 'Estudiante o graduado en Contaduría, Economía o Finanzas\nManejo de Excel avanzado\nConocimientos de NIIF\nPensamiento analítico', skills: 'Excel,Contabilidad,SQL', benefits: 'Salario competitivo\nAcciones de la empresa\nSeguro médico premium\nTrabajo remoto', salary_min: 2000000, salary_max: 3000000, city: 'Bogotá', modality: 'Híbrido', contract: 'Tiempo completo', exp: 1, area: 'Finanzas', is_int: 0, no_exp: 0 },
    { cIdx: 4, title: 'Desarrollador Fullstack Junior', desc: 'Construye las plataformas de pagos del futuro con nuestro equipo de ingeniería.', responsibilities: 'Desarrollar funcionalidades fullstack\nIntegrar APIs de pago\nEscribir pruebas unitarias\nParticipación en sprints ágiles', requirements: 'Conocimientos de React y Node.js\nManejo básico de bases de datos\nFamiliariedad con metodologías ágiles\nGanas de aprender en fintech', skills: 'JavaScript,React,Node.js,SQL', benefits: 'Bono de bienvenida\nMentoría técnica\nAcceso a cursos en línea\nHorario flexible', salary_min: 2500000, salary_max: 4000000, city: 'Bogotá', modality: 'Remoto', contract: 'Tiempo completo', exp: 0, area: 'Tecnología', is_int: 0, no_exp: 1 },

    // HealthAI - companyIds[5]
    { cIdx: 5, title: 'Pasante de Inteligencia Artificial en Salud', desc: 'Práctica única en el desarrollo de modelos de IA para diagnóstico médico asistido por computador.', responsibilities: 'Preprocesar datasets médicos\nEntrenar modelos de clasificación\nValidar resultados con médicos\nDocumentar hallazgos técnicos', requirements: 'Estudiante de Sistemas, Bioingeniería o Medicina con enfoque tecnológico\nConocimientos de Python y scikit-learn\nInterés en salud digital\nDisponibilidad de 12 meses', skills: 'Python,SQL,Excel', benefits: 'Auxilio de práctica\nAcceso a datasets reales (anonimizados)\nPublicaciones académicas\nEmbajada global', salary_min: 1200000, salary_max: 1800000, city: 'Medellín', modality: 'Híbrido', contract: 'Contrato de aprendizaje', exp: 0, area: 'Salud', is_int: 1, no_exp: 1 },
    { cIdx: 5, title: 'Coordinador de Proyectos de Salud Digital', desc: 'Coordina la implementación de soluciones de telemedicina en clínicas aliadas.', responsibilities: 'Gestionar proyectos de implementación\nCoordinar con clientes médicos\nElaborar documentación técnica\nHacer seguimiento a indicadores', requirements: 'Profesional o estudiante avanzado de Salud, Sistemas o Administración\nHabilidades de gestión de proyectos\nComunicación efectiva\nInglés básico-intermedio', skills: 'Gestión de Proyectos,Comunicación Efectiva,Excel', benefits: 'Medicina prepagada\nFlexibilidad de horario\nCapacitaciones internacionales\nBonificaciones', salary_min: 2500000, salary_max: 3500000, city: 'Medellín', modality: 'Híbrido', contract: 'Tiempo completo', exp: 1, area: 'Salud', is_int: 0, no_exp: 0 },

    // EduPlus - companyIds[6]
    { cIdx: 6, title: 'Creador de Contenido Educativo', desc: 'Crea cursos online impactantes para más de 500,000 estudiantes en América Latina.', responsibilities: 'Diseñar currículos de cursos online\nGrabar videos y materiales didácticos\nCrear ejercicios y evaluaciones\nActualizar contenido regularmente', requirements: 'Profesional en cualquier área del conocimiento\nHabilidades de comunicación\nMejora continua\nIngles intermedio deseable', skills: 'Comunicación Efectiva,Excel,Marketing Digital', benefits: 'Trabajo 100% remoto\nIngresos por regalías\nFlexibilidad total de horario\nComunidad de creadores', salary_min: 1000000, salary_max: 3000000, city: 'Bogotá', modality: 'Remoto', contract: 'Freelance', exp: 0, area: 'Educación', is_int: 0, no_exp: 1 },
    { cIdx: 6, title: 'Pasante de Pedagogía Digital', desc: 'Práctica en diseño instruccional y tecnología educativa. Ayuda a transformar la educación en Latam.', responsibilities: 'Diseñar experiencias de aprendizaje\nAnalizar métricas de cursos\nApoyar a instructores\nCrear materiales de apoyo', requirements: 'Estudiante de Educación, Pedagogía o Psicología\nPasión por la tecnología educativa\nComunicación efectiva\nDisponibilidad de 6 meses', skills: 'Comunicación Efectiva,Excel,Figma', benefits: 'Acceso gratuito a todos los cursos\nCertificado de práctica\nFlexibilidad\nPosibilidad de vinculación', salary_min: 800000, salary_max: 1000000, city: 'Bogotá', modality: 'Remoto', contract: 'Contrato de aprendizaje', exp: 0, area: 'Educación', is_int: 1, no_exp: 1 },

    // Construcciones Modernas - companyIds[7]
    { cIdx: 7, title: 'Ingeniero Civil Pasante', desc: 'Participa en proyectos de construcción de edificios sostenibles en las principales ciudades del país.', responsibilities: 'Supervisar avances de obra\nElaborar informes técnicos\nApoyar en presupuestos de construcción\nRealizar interventoría básica', requirements: 'Estudiante de últimos semestres de Ingeniería Civil\nConocimientos de AutoCAD\nInterés en construcción sostenible\nDisponibilidad de 6 meses', skills: 'AutoCAD,Excel,Gestión de Proyectos', benefits: 'ARL incluido\nViáticos de desplazamiento\nEquipo de protección\nCertificado de práctica', salary_min: 1000000, salary_max: 1400000, city: 'Cali', modality: 'Presencial', contract: 'Contrato de aprendizaje', exp: 0, area: 'Ingeniería', is_int: 1, no_exp: 1 },
    { cIdx: 7, title: 'Dibujante CAD Junior', desc: 'Elabora planos arquitectónicos y estructurales para proyectos de vivienda y comerciales.', responsibilities: 'Crear y modificar planos en AutoCAD\nElaborar renders básicos\nArchivar documentación técnica\nCoordinar con ingenieros de proyecto', requirements: 'Técnico o estudiante de Dibujo Técnico, Arquitectura o Ingeniería Civil\nManejo de AutoCAD mínimo básico\nAtención al detalle\nOrganización', skills: 'AutoCAD,Excel', benefits: 'Capacitación en software BIM\nEstabilidad laboral\nPrestaciones completas\nBono de transporte', salary_min: 1200000, salary_max: 1800000, city: 'Cali', modality: 'Presencial', contract: 'Tiempo completo', exp: 0, area: 'Ingeniería', is_int: 0, no_exp: 1 },

    // AgroCol Tech - companyIds[8]
    { cIdx: 8, title: 'Técnico en Sensores IoT Agrícolas', desc: 'Instala y mantiene redes de sensores inteligentes en cultivos de todo el país.', responsibilities: 'Instalar sensores en campo\nMonitorear datos de cultivos en tiempo real\nDiagnosticar y reparar fallas\nCapacitar a agricultores', requirements: 'Técnico o tecnólogo en Electrónica, Sistemas o Agronomía\nConocimientos de IoT\nDisposición para trabajo en campo\nLicencia de conducción', skills: 'Excel,Gestión de Proyectos', benefits: 'Viáticos completos\nVehículo de la empresa\nCelular corporativo\nBonos por zona', salary_min: 1500000, salary_max: 2200000, city: 'Bucaramanga', modality: 'Presencial', contract: 'Tiempo completo', exp: 0, area: 'Agroindustria', is_int: 0, no_exp: 1 },
    { cIdx: 8, title: 'Pasante de Agronomía con Enfoque Tecnológico', desc: 'Práctica en el área de agricultura de precisión utilizando drones, sensores e inteligencia artificial.', responsibilities: 'Analizar datos de producción agrícola\nOperar drones de monitoreo\nElaborar informes técnicos\nApoyar en diseño de sistemas de riego inteligente', requirements: 'Estudiante de Agronomía, Ingeniería Agrícola o afines\nInterés en tecnología agrícola\nDisponibilidad para trabajo en campo\nDisponibilidad de 6 meses', skills: 'Excel,Python', benefits: 'Transporte y alimentación en campo\nViáticos\nCertificado de práctica\nAcceso a tecnología de punta', salary_min: 900000, salary_max: 1200000, city: 'Bucaramanga', modality: 'Presencial', contract: 'Contrato de aprendizaje', exp: 0, area: 'Agroindustria', is_int: 1, no_exp: 1 },

    // Creativa Studio - companyIds[9]
    { cIdx: 9, title: 'Diseñador Gráfico Junior', desc: 'Crea identidades de marca, materiales publicitarios y contenido visual para clientes de diferentes industrias.', responsibilities: 'Diseñar identidades de marca\nCrear piezas para redes sociales\nElaborar presentaciones ejecutivas\nColaborar en producción audiovisual', requirements: 'Estudiante o graduado de Diseño Gráfico\nPortafolio creativo\nManejo de Adobe Creative Suite\nPensamiento creativo', skills: 'Photoshop,Illustrator,Figma', benefits: 'Ambiente creativo estimulante\nProyectos variados\nFlexibilidad de horario\nTrabajo híbrido', salary_min: 1400000, salary_max: 2000000, city: 'Bogotá', modality: 'Híbrido', contract: 'Tiempo completo', exp: 0, area: 'Diseño', is_int: 0, no_exp: 1 },
    { cIdx: 9, title: 'Pasante de Motion Graphics', desc: 'Práctica en animación y motion graphics para proyectos publicitarios digitales.', responsibilities: 'Crear animaciones para redes sociales\nEditar videos corporativos\nDesarrollar storyboards\nAprender herramientas de animación 2D y 3D', requirements: 'Estudiante de Diseño, Comunicación o Producción Audiovisual\nConocimientos básicos de After Effects o Premiere\nPortafolio de trabajos\nCreatividad', skills: 'Photoshop,Illustrator,Figma', benefits: 'Acceso a software premium\nMentoring de animadores senior\nCertificado de práctica\nAmbienter creativo', salary_min: 800000, salary_max: 1100000, city: 'Bogotá', modality: 'Híbrido', contract: 'Contrato de aprendizaje', exp: 0, area: 'Diseño', is_int: 1, no_exp: 1 },
    { cIdx: 9, title: 'Estratega de Contenido Digital', desc: 'Desarrolla estrategias de contenido multiplataforma para marcas líderes en el mercado colombiano.', responsibilities: 'Crear calendarios editoriales\nRedactar contenido para blogs y redes\nAnálisis de métricas de contenido\nCoordinar con diseñadores y clientes', requirements: 'Comunicador, Periodista, Publicista o afín\nHabilidades excepcionales de redacción\nConocimiento de plataformas digitales\nPortafolio de contenidos', skills: 'Marketing Digital,SEO/SEM,Comunicación Efectiva', benefits: 'Trabajo remoto\nFlexibilidad de horario\nClientes premium\nComisiones por proyectos', salary_min: 1600000, salary_max: 2400000, city: 'Bogotá', modality: 'Remoto', contract: 'Freelance', exp: 1, area: 'Marketing', is_int: 0, no_exp: 0 },

    // Extra jobs from TechCo
    { cIdx: 0, title: 'Soporte Técnico IT Junior', desc: 'Brinda soporte técnico de primer nivel a usuarios internos y clientes.', responsibilities: 'Atender tickets de soporte\nInstalar y configurar software\nDiagnosticar problemas de hardware\nDocumentar soluciones', requirements: 'Técnico o tecnólogo en sistemas\nConocimientos de redes básicas\nActitud de servicio\nPaciencia y comunicación', skills: 'Excel,Comunicación Efectiva', benefits: 'Capacitaciones certificadas\nHorario rotativo con recargos\nPrestaciones completas\nGrowth plan definido', salary_min: 1100000, salary_max: 1600000, city: 'Bogotá', modality: 'Presencial', contract: 'Tiempo completo', exp: 0, area: 'Tecnología', is_int: 0, no_exp: 1 },
    { cIdx: 1, title: 'Pasante de Business Intelligence', desc: 'Práctica en el área de BI, construyendo dashboards y análisis para clientes corporativos.', responsibilities: 'Desarrollar dashboards en Power BI\nLimpiar y modelar datos\nElaborar reportes gerenciales\nAnalizar tendencias de negocio', requirements: 'Estudiante de Ingeniería, Estadística o Economía\nConocimientos de Excel avanzado\nInterés en análisis de datos\nDisponibilidad de 6 meses', skills: 'Excel,Power BI,SQL', benefits: 'Acceso a herramientas BI\nCapacitación en Power BI Premium\nCertificado de práctica\nPosible vinculación', salary_min: 950000, salary_max: 1300000, city: 'Medellín', modality: 'Híbrido', contract: 'Contrato de aprendizaje', exp: 0, area: 'Datos e IA', is_int: 1, no_exp: 1 },
    { cIdx: 4, title: 'Asesor Comercial Digital', desc: 'Asesora a clientes sobre nuestros productos fintech y ayúdalos a adoptar la banca digital.', responsibilities: 'Asesorar clientes por chat y videollamada\nOnboarding de nuevos usuarios\nCumplir metas comerciales\nFeedback de mejora de productos', requirements: 'Estudiante o graduado de cualquier carrera\nHabilidades comerciales\nEmpatía y comunicación\nManejo de computador', skills: 'Comunicación Efectiva,Excel', benefits: 'Comisiones sin techo\nHorario flexible\nCapacitación en fintech\nTrabajo remoto', salary_min: 1000000, salary_max: 2500000, city: 'Bogotá', modality: 'Remoto', contract: 'Medio tiempo', exp: 0, area: 'Ventas', is_int: 0, no_exp: 1 },
    { cIdx: 2, title: 'Ejecutivo de Cuentas Junior', desc: 'Gestiona relaciones con clientes de marketing digital y coordina la entrega de campañas.', responsibilities: 'Ser el punto de contacto con clientes\nCoordinar equipos de marketing\nElaborar reportes de resultados\nProspección de nuevos clientes', requirements: 'Estudiante o graduado de Administración, Marketing o afines\nHabilidades comerciales y comunicativas\nOrganización\nInglés básico', skills: 'Marketing Digital,Comunicación Efectiva,Excel', benefits: 'Bono por cumplimiento\nCapacitaciones\nViáticos de representación\nCrecimiento acelerado', salary_min: 1500000, salary_max: 2500000, city: 'Cali', modality: 'Presencial', contract: 'Tiempo completo', exp: 0, area: 'Ventas', is_int: 0, no_exp: 1 },
    { cIdx: 5, title: 'Pasante de Desarrollo de Software Médico', desc: 'Práctica en desarrollo de software para dispositivos médicos y plataformas de salud digital.', responsibilities: 'Desarrollar módulos de software médico\nParticipación en testing clínico\nDocumentación técnica regulatoria\nColaboración interdisciplinar', requirements: 'Estudiante de Bioingeniería, Ingeniería Biomédica o Sistemas\nConocimientos de programación\nInterés en salud digital\nDisponibilidad de 12 meses', skills: 'Python,JavaScript,SQL', benefits: 'Participación en investigación\nPublicaciones académicas\nRed de contactos médico-tech\nAuxilio de práctica', salary_min: 1100000, salary_max: 1500000, city: 'Medellín', modality: 'Híbrido', contract: 'Contrato de aprendizaje', exp: 0, area: 'Salud', is_int: 1, no_exp: 1 },
  ];

  const jobIds = [];
  const now = new Date();
  for (const j of jobsData) {
    const deadline = new Date(now);
    deadline.setDate(deadline.getDate() + 30 + Math.floor(Math.random() * 60));
    const r = db.prepare(`INSERT INTO jobs (company_id, title, description, responsibilities, requirements, skills, benefits, salary_min, salary_max, city, modality, contract_type, experience_years, area, is_internship, no_experience_ok, deadline, applicants_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(companyIds[j.cIdx], j.title, j.desc, j.responsibilities, j.requirements, j.skills, j.benefits, j.salary_min, j.salary_max, j.city, j.modality, j.contract, j.exp, j.area, j.is_int, j.no_exp, deadline.toISOString().split('T')[0], Math.floor(Math.random() * 25));
    jobIds.push(r.lastInsertRowid);
  }

  // ===========================
  // APPLICATIONS (15)
  // ===========================
  const appStatuses = ['sent', 'reviewing', 'preselected', 'interview', 'selected', 'rejected'];
  const appData = [
    { sIdx: 0, jIdx: 0, status: 'interview' },
    { sIdx: 0, jIdx: 3, status: 'reviewing' },
    { sIdx: 0, jIdx: 10, status: 'sent' },
    { sIdx: 0, jIdx: 11, status: 'preselected' },
    { sIdx: 0, jIdx: 19, status: 'rejected' },
    { sIdx: 1, jIdx: 5, status: 'sent' },
    { sIdx: 1, jIdx: 12, status: 'reviewing' },
    { sIdx: 2, jIdx: 8, status: 'interview' },
    { sIdx: 2, jIdx: 9, status: 'sent' },
    { sIdx: 3, jIdx: 6, status: 'preselected' },
    { sIdx: 4, jIdx: 0, status: 'selected' },
    { sIdx: 4, jIdx: 2, status: 'reviewing' },
    { sIdx: 5, jIdx: 13, status: 'sent' },
    { sIdx: 6, jIdx: 3, status: 'reviewing' },
    { sIdx: 7, jIdx: 5, status: 'sent' },
  ];

  for (const ap of appData) {
    const daysAgo = Math.floor(Math.random() * 30);
    const appliedDate = new Date(now);
    appliedDate.setDate(appliedDate.getDate() - daysAgo);
    db.prepare(`INSERT OR IGNORE INTO applications (student_id, job_id, status, applied_at) VALUES (?, ?, ?, ?)`)
      .run(studentIds[ap.sIdx], jobIds[ap.jIdx], ap.status, appliedDate.toISOString());
    // Update applicants count
    db.prepare(`UPDATE jobs SET applicants_count = applicants_count + 1 WHERE id = ?`).run(jobIds[ap.jIdx]);
  }

  // Saved jobs for demo student
  for (let i = 1; i <= 5; i++) {
    db.prepare(`INSERT OR IGNORE INTO saved_jobs (student_id, job_id) VALUES (?, ?)`).run(studentIds[0], jobIds[i]);
  }

  // ===========================
  // COURSES (10)
  // ===========================
  const coursesData = [
    { title: 'Excel para Profesionales', desc: 'Domina Microsoft Excel desde nivel básico hasta avanzado. Aprende tablas dinámicas, macros, fórmulas complejas y visualización de datos.', hours: 20, level: 'Básico', area: 'Herramientas', instructor: 'Ing. Carlos Vega' },
    { title: 'Power BI: Análisis de Datos Visual', desc: 'Aprende a crear dashboards profesionales e informes interactivos con Power BI. Conecta fuentes de datos, modela y visualiza insights clave.', hours: 25, level: 'Intermedio', area: 'Datos e IA', instructor: 'Dra. Ana Ríos' },
    { title: 'Python para Análisis de Datos', desc: 'Aprende Python desde cero con enfoque en análisis de datos usando pandas, NumPy, Matplotlib y Seaborn. Ideal para estudiantes de cualquier carrera.', hours: 30, level: 'Básico', area: 'Programación', instructor: 'Ing. Miguel Torres' },
    { title: 'Desarrollo Web con React', desc: 'Construye aplicaciones web modernas con React, hooks, estado global y consumo de APIs. Proyecto final real incluido.', hours: 40, level: 'Intermedio', area: 'Programación', instructor: 'Ing. Sofía Morales' },
    { title: 'Inglés para el Mundo Laboral', desc: 'Mejora tu inglés enfocado en entornos profesionales: correos, reuniones, entrevistas y presentaciones en inglés.', hours: 35, level: 'Básico', area: 'Idiomas', instructor: 'Prof. James Wilson' },
    { title: 'Comunicación Profesional y Oratoria', desc: 'Desarrolla habilidades de comunicación efectiva, hablar en público y presentación profesional para entrevistas y reuniones de trabajo.', hours: 15, level: 'Básico', area: 'Soft Skills', instructor: 'Dra. Laura Castillo' },
    { title: 'Preparación para Entrevistas de Trabajo', desc: 'Aprende a prepararte para cualquier entrevista laboral: cómo presentarte, responder preguntas difíciles, negociar salario y hacer seguimiento.', hours: 10, level: 'Básico', area: 'Empleabilidad', instructor: 'Psic. Camila Barrera' },
    { title: 'Hoja de Vida y LinkedIn Efectivos', desc: 'Crea una hoja de vida que destaque y optimiza tu perfil de LinkedIn para atraer a los reclutadores correctos.', hours: 8, level: 'Básico', area: 'Empleabilidad', instructor: 'Reclutadora Natalia Ruiz' },
    { title: 'Machine Learning con Python', desc: 'Introducción al Machine Learning usando scikit-learn. Aprende regresión, clasificación, clustering y evaluación de modelos.', hours: 45, level: 'Avanzado', area: 'Datos e IA', instructor: 'Dr. Andrés Peña' },
    { title: 'SQL para Análisis de Negocios', desc: 'Aprende SQL desde cero hasta consultas avanzadas. Trabajarás con bases de datos reales y casos de negocio prácticos.', hours: 20, level: 'Básico', area: 'Datos e IA', instructor: 'Ing. Diego Vargas' },
  ];

  for (const c of coursesData) {
    const r = db.prepare(`INSERT INTO courses (title, description, duration_hours, level, area, instructor, rating, students_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(c.title, c.desc, c.hours, c.level, c.area, c.instructor, (4 + Math.random()).toFixed(1), Math.floor(Math.random() * 3000 + 500));
  }

  // Enroll demo student in some courses
  const allCourses = db.prepare('SELECT id FROM courses').all();
  for (let i = 0; i < 3; i++) {
    db.prepare(`INSERT OR IGNORE INTO enrollments (student_id, course_id, progress) VALUES (?, ?, ?)`)
      .run(studentIds[0], allCourses[i].id, [65, 30, 100][i]);
  }

  // ===========================
  // NOTIFICATIONS
  // ===========================
  const notifUser = db.prepare('SELECT id FROM users WHERE email = ?').get('estudiante@demo.com');
  const notifData = [
    { title: '¡Bienvenido a UniEmpleo!', message: 'Tu cuenta ha sido creada exitosamente. Completa tu perfil para obtener mejores recomendaciones.', type: 'success', read: 0 },
    { title: 'Tu postulación fue revisada', message: 'La empresa TechCo SAS revisó tu postulación para Desarrollador Frontend Junior.', type: 'info', read: 0 },
    { title: '¡Invitación a entrevista!', message: 'TechCo SAS te invita a una entrevista el próximo martes a las 10:00 AM.', type: 'success', read: 0 },
    { title: 'Nueva vacante compatible', message: 'Se publicó una nueva vacante de Desarrollador React que coincide con tu perfil.', type: 'info', read: 1 },
    { title: 'Completa tu perfil', message: 'Tu perfil está al 70%. Agrega tus habilidades y experiencias para aumentar tus posibilidades.', type: 'warning', read: 1 },
  ];
  for (const n of notifData) {
    db.prepare(`INSERT INTO notifications (user_id, title, message, type, read) VALUES (?, ?, ?, ?, ?)`).run(notifUser.id, n.title, n.message, n.type, n.read);
  }

  // Education for demo student
  db.prepare(`INSERT INTO educations (student_id, institution, degree, field, start_year, current) VALUES (?, ?, ?, ?, ?, 1)`)
    .run(studentIds[0], 'Universidad Nacional de Colombia', 'Pregrado', 'Ingeniería de Sistemas', 2021);

  // Experience for demo student
  db.prepare(`INSERT INTO experiences (student_id, company, position, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)`)
    .run(studentIds[0], 'FreelanceTech', 'Desarrollador Web Freelance', '2023-01-01', '2024-06-30', 'Desarrollo de sitios web para pequeñas y medianas empresas usando React y Node.js.');

  console.log('✅ Database seeded successfully!');
  console.log('📧 Credenciales:');
  console.log('   Estudiante: estudiante@demo.com / demo1234');
  console.log('   Empresa:    empresa@demo.com / demo1234');
  console.log('   Admin:      admin@uniempleo.com / admin1234');
}

module.exports = { seedDatabase };
