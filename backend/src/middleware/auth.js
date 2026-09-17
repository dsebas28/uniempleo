const { verifyToken } = require('../utils/jwt');
const { getDb } = require('../database/db');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    const userId = payload.userId || payload.id;
    const db = getDb();
    const user = db.prepare('SELECT id, email, role, active FROM users WHERE id = ?').get(userId);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    if (!user.active) return res.status(403).json({ error: 'Tu cuenta ha sido desactivada o bloqueada por la administración' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
