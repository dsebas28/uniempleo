import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationsAPI } from '../services/api';
import Logo from '../components/Logo';
import Avatar from '../components/ui/Avatar';
import {
  LayoutDashboard, User, FileText, Heart, Bell, BellRing, BookOpen,
  LogOut, Menu, X, ChevronRight,
  MessageSquare, Search
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/perfil', icon: User, label: 'Mi Perfil' },
  { to: '/postulaciones', icon: FileText, label: 'Mis Postulaciones' },
  { to: '/favoritos', icon: Heart, label: 'Favoritos' },
  { to: '/alertas-empleo', icon: BellRing, label: 'Alertas de empleo' },
  { to: '/notificaciones', icon: Bell, label: 'Notificaciones' },
  { to: '/cursos', icon: BookOpen, label: 'Academy' },
  { to: '/preparacion', icon: MessageSquare, label: 'Preparación' },
  { separator: true },
  { to: '/empleos', icon: Search, label: 'Buscar empleos' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [search, setSearch] = useState('');

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  // El backend anida el perfil bajo `profile` con columnas snake_case (full_name);
  // tras editar el perfil, AuthContext también puede tener `fullName` a nivel plano.
  const displayName = user?.profile?.full_name || user?.fullName || user?.email?.split('@')[0] || 'Estudiante';
  const university = user?.profile?.university || '';
  const career = user?.profile?.career || '';
  const photo = user?.profile?.profile_photo;

  useEffect(() => {
    notificationsAPI.getAll().then(res => setNotifCount(res.data?.unread || 0)).catch(() => {});
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/empleos?keyword=${encodeURIComponent(search.trim())}`);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-white/10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo size={30} className="group-hover:opacity-90 transition-opacity" />
        </Link>
      </div>

      {/* User card */}
      <div className="px-3 py-3">
        <div className="px-3.5 py-3 rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50/40 dark:from-white/[0.06] dark:to-white/[0.02] border border-brand-100/60 dark:border-white/10">
          <div className="flex items-center gap-2.5">
            <Avatar name={displayName} src={photo} size="md" />
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-white text-sm truncate leading-tight">{displayName}</p>
              <p className="text-xs text-brand-600 dark:text-brand-300 font-medium mt-0.5 truncate">
                {career || 'Estudiante'}
              </p>
            </div>
          </div>
          {university && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 truncate">{university}</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1 overflow-y-auto py-1">
        {navItems.map((item, idx) => {
          if (item.separator) return <div key={idx} className="my-2 border-t border-slate-100 dark:border-white/10" />;
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all duration-150 ${
                active
                  ? 'bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-200 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={16} className={active ? 'text-brand-600 dark:text-brand-300' : 'text-slate-400 dark:text-slate-500'} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={13} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100 dark:border-white/10 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:text-rose-700 transition-colors duration-150"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0b1120] overflow-hidden transition-colors duration-300">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-[#111827] border-r border-slate-100 dark:border-white/10 shadow-sm flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-white dark:bg-[#111827] shadow-2xl">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-white/10 shadow-sm">
          <button
            className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={19} />
          </button>
          <span className="md:hidden font-display font-bold text-slate-900 dark:text-white">UniEmpleo</span>

          <form onSubmit={handleSearch} className="hidden sm:flex flex-1 max-w-sm">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar empleos..."
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/notificaciones"
              className="relative p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
            >
              <Bell size={19} />
              {notifCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifCount > 9 ? '9+' : notifCount}
                </span>
              )}
            </Link>
            <Avatar name={displayName} src={photo} size="sm" />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
