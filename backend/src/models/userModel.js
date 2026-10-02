const { getDb } = require('../database/db');

const userModel = {
  async findByEmail(email) {
    const db = getDb();
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  async findById(id) {
    const db = getDb();
    return db.prepare('SELECT id, email, role, active, created_at FROM users WHERE id = ?').get(id);
  },

  async create(email, hashedPassword, role) {
    const db = getDb();
    const result = await db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?) RETURNING id').run(email, hashedPassword, role);
    return result.lastInsertRowid;
  },

  async getAll({ role, page = 1, limit = 20 } = {}) {
    const db = getDb();
    let query = 'SELECT u.id, u.email, u.role, u.active, u.created_at FROM users u WHERE 1=1';
    const params = [];
    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }
    query += ' ORDER BY u.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    const users = await db.prepare(query).all(...params);

    const total = (await db.prepare(`SELECT COUNT(*) as c FROM users ${role ? 'WHERE role = ?' : ''}`).get(...(role ? [role] : []))).c;
    return { users, total };
  },

  async setActive(id, active) {
    const db = getDb();
    return db.prepare('UPDATE users SET active = ?, updated_at = LOCALTIMESTAMP(0) WHERE id = ?').run(!!active, id);
  },

  async countByRole(role) {
    const db = getDb();
    return (await db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get(role)).count;
  },

  async getRecent(limit = 10) {
    const db = getDb();
    return db.prepare('SELECT id, email, role, active, created_at FROM users ORDER BY created_at DESC LIMIT ?').all(limit);
  }
};

module.exports = userModel;
