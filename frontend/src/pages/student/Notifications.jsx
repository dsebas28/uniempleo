import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Loader2, CheckCheck, Star, AlertTriangle, XCircle, Info, ChevronRight } from 'lucide-react';
import { notificationsAPI } from '../../services/api';
import { timeAgo } from '../../utils/date';
import EmptyState from '../../components/EmptyState';
import toast from 'react-hot-toast';

// El backend solo produce estos 4 tipos (restricción de la tabla notifications)
const ICON_MAP = {
  success: Star,
  warning: AlertTriangle,
  error: XCircle,
  info: Info,
};

const TYPE_COLORS = {
  success: 'bg-emerald-100 text-emerald-600',
  warning: 'bg-amber-100 text-amber-600',
  error: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationsAPI.getAll().then(res => {
      setNotifications(res.data?.notifications || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    try {
      await notificationsAPI.markAllRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('Todas marcadas como leídas');
    } catch { toast.error('Error'); }
  };

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try { await notificationsAPI.markRead(id); } catch {}
  };

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Outfit' }}>Notificaciones</h1>
          {unread > 0 && (
            <p className="text-sm text-blue-600 font-medium mt-0.5">{unread} sin leer</p>
          )}
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors">
            <CheckCheck size={16} /> Marcar todas como leídas
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="text-blue-400 animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          type="notifications"
          title="No tienes notificaciones"
          description="Cuando las empresas revisen tu perfil o haya novedades en tus postulaciones, aparecerán aquí."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {notifications.map((notif, idx) => {
            const Icon = ICON_MAP[notif.type] || ICON_MAP.info;
            const colorCls = TYPE_COLORS[notif.type] || TYPE_COLORS.info;
            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && markRead(notif.id)}
                className={`flex items-start gap-4 p-5 transition-colors hover:bg-gray-50 ${
                  idx > 0 ? 'border-t border-gray-50' : ''
                } ${!notif.read ? 'bg-blue-50/30' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorCls}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notif.title}
                    </p>
                    {!notif.read && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 leading-relaxed whitespace-pre-line">{notif.message}</p>
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2"
                    >
                      Ver postulación <ChevronRight size={12} />
                    </Link>
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">{timeAgo(notif.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
