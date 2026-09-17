const { getDb } = require('../database/db');

const notificationModel = {
  create(userId, title, message, type = 'info', link = null) {
    const db = getDb();
    const result = db.prepare(`
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, title, message, type, link);
    return result.lastInsertRowid;
  },

  getByUserId(userId) {
    const db = getDb();
    return db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC LIMIT 50
    `).all(userId);
  },

  markAsRead(id, userId) {
    const db = getDb();
    return db.prepare('UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?').run(id, userId);
  },

  markAllAsRead(userId) {
    const db = getDb();
    return db.prepare('UPDATE notifications SET read = 1 WHERE user_id = ?').run(userId);
  }
};

module.exports = notificationModel;
