const { verifyToken } = require('../utils/jwt');
const userModel = require('../models/userModel');

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación requerido' });
  }
  const token = authHeader.split(' ')[1];

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }

  try {
    // Se consulta el usuario en cada petición: una cuenta desactivada pierde el acceso al instante
    const user = await userModel.findById(payload.userId || payload.id);
    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' });
    if (!user.active) return res.status(403).json({ error: 'Tu cuenta ha sido desactivada o bloqueada por la administración' });
    req.user = { id: user.id, email: user.email, role: user.role, active: user.active };
    next();
  } catch (err) {
    next(err);
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
