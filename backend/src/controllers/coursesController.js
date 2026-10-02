const courseModel = require('../models/courseModel');
const studentModel = require('../models/studentModel');

async function getCourses(req, res) {
  try {
    const { area, level } = req.query;
    res.json(await courseModel.getAll({ area, level }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getCourseById(req, res) {
  try {
    const course = await courseModel.getById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    const modules = await courseModel.getModules(course.id);
    res.json({ ...course, modules });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function enrollCourse(req, res) {
  try {
    const student = await studentModel.findByUserId(req.user.id);
    if (!student) return res.status(404).json({ error: 'Perfil no encontrado' });
    const course = await courseModel.getById(req.params.courseId);
    if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
    await courseModel.enroll(student.id, course.id);
    res.json({ message: 'Inscripción exitosa' });
  } catch {
    res.status(500).json({ error: 'Error al inscribirse' });
  }
}

async function getEnrollments(req, res) {
  try {
    const student = await studentModel.findByUserId(req.user.id);
    if (!student) return res.status(404).json({ error: 'Perfil no encontrado' });
    res.json(await courseModel.getEnrollments(student.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getCourses, getCourseById, enrollCourse, getEnrollments };
