const jobAlertModel = require('../models/jobAlertModel');
const emailLogModel = require('../models/emailLogModel');
const notificationModel = require('../models/notificationModel');
const jobModel = require('../models/jobModel');

const jobAlertService = {
  getMyAlerts(studentId) {
    return jobAlertModel.getByStudentId(studentId);
  },

  createAlert(studentId, data) {
    if (!data.area && !data.city && !data.modality && !data.keywords) {
      throw new Error('Define al menos un criterio para la alerta (área, ciudad, modalidad o palabra clave)');
    }
    const id = jobAlertModel.create(studentId, data);
    return { id, message: 'Alerta de empleo creada. Te avisaremos por correo cuando se publique una vacante que coincida.' };
  },

  toggleAlert(studentId, alertId, active) {
    jobAlertModel.setActive(alertId, studentId, active);
    return { message: active ? 'Alerta activada' : 'Alerta pausada' };
  },

  deleteAlert(studentId, alertId) {
    jobAlertModel.remove(alertId, studentId);
    return { message: 'Alerta eliminada' };
  },

  // Se ejecuta al publicar una vacante nueva: busca alertas activas que calcen y
  // "envía" el correo (por ahora se registra en email_log en vez de salir a un SMTP real)
  // más una notificación in-app equivalente.
  notifyMatchingStudents(jobId) {
    const job = jobModel.getById(jobId);
    if (!job) return 0;

    const candidates = jobAlertModel.findMatchingActive(job);
    const matches = candidates.filter(alert => {
      if (!alert.keywords) return true;
      const haystack = `${job.title} ${job.description}`.toLowerCase();
      return haystack.includes(alert.keywords.toLowerCase());
    });

    for (const alert of matches) {
      const subject = `Nueva vacante para ti: ${job.title}`;
      const body = `Hola ${alert.full_name},\n\n` +
        `Se publicó una vacante que coincide con tu alerta de empleo:\n\n` +
        `"${job.title}"\n${job.city} · ${job.modality} · ${job.area}\n\n` +
        `Revísala y postúlate desde UniEmpleo: /empleos/${job.id}`;

      emailLogModel.create({ studentId: alert.student_id, jobId: job.id, alertId: alert.id, toEmail: alert.email, subject, body });

      notificationModel.create(
        alert.user_id,
        'Nueva vacante que coincide con tu alerta',
        `"${job.title}" en ${job.city} (${job.modality}) — según tu alerta de empleo configurada.`,
        'info',
        `/empleos/${job.id}`
      );
    }

    return matches.length;
  }
};

module.exports = jobAlertService;
