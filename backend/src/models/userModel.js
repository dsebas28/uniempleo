const { getDb } = require('../database/db');

const userModel = {
  findByEmail(email) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    const db = getDb();
    return db.prepare('SELECT id, email, role, active, created_at FROM users WHERE id = ?').get(id);
  },

  create(email, hashedPassword, role) {
    const db = getDb();
    const result = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run(email, hashedPassword, role);
    return result.lastInsertRowid;
  },

  getAll({ role, page = 1, limit = 20 } = {}) {
    const db = getDb();
    let query = 'SELECT u.id, u.email, u.role, u.active, u.created_at FROM users u WHERE 1=1';
    const params = [];
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }
    query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const users = db.prepare(query).all(...params);

    const total = db.prepare(`SELECT COUNT(*) as c FROM users ${role ? 'WHERE role = ?' : ''}`).get(...(role ? [role] : [])).c;
    return { users, total };
  },

  setActive(id, active) {
    const db = getDb();
    return db.prepare('UPDATE users SET active = ? WHERE id = ?').run(active ? 1 : 0, id);
  },

  countByRole(role) {
    const db = getDb();
    return db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get(role).count;
  },

  getRecent(limit = 10) {
    const db = getDb();
    return db.prepare('SELECT id, email, role, active, created_at FROM users ORDER BY created_at DESC LIMIT ?').all(limit);
  }
};

module.exports = userModel;
