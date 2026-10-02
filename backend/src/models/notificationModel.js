const { getDb } = require('../database/db');

const notificationModel = {
  async create(userId, title, message, type = 'info', link = null) {
    const db = getDb();
    const result = await db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?)
      RETURNING id
    `).run(userId, title, message, type, link);
    return result.lastInsertRowid;
  },

  async getByUserId(userId, limit = 30) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC LIMIT ?
    `).all(userId, limit);
  },

  async countUnread(userId) {
    const db = getDb();
    return (await db.prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id = ? AND NOT read').get(userId)).c;
  },

  async markAsRead(id, userId) {
    const db = getDb();
    return db.prepare('UPDATE notifications SET read = TRUE WHERE id = ? AND user_id = ?').run(id, userId);
  },

  async markAllAsRead(userId) {
    const db = getDb();
    return db.prepare('UPDATE notifications SET read = TRUE WHERE user_id = ?').run(userId);
  }
};

module.exports = notificationModel;
