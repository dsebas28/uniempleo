const notificationModel = require('../models/notificationModel');

async function getNotifications(req, res) {
  try {
    const [notifications, unread] = await Promise.all([
      notificationModel.getByUserId(req.user.id, 30),
      notificationModel.countUnread(req.user.id),
    ]);
    res.json({ notifications, unread });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markAsRead(req, res) {
  try {
    await notificationModel.markAsRead(req.params.id, req.user.id);
    res.json({ message: 'Notificación marcada como leída' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function markAllRead(req, res) {
  try {
    await notificationModel.markAllAsRead(req.user.id);
    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getNotifications, markAsRead, markAllRead };
