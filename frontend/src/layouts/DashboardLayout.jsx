import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, FileText, Heart, Bell, BookOpen,
  GraduationCap, LogOut, Menu, X, ChevronRight,
  MessageSquare, Search
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/perfil', icon: User, label: 'Mi Perfil' },
  { to: '/postulaciones', icon: FileText, label: 'Mis Postulaciones' },
  { to: '/favoritos', icon: Heart, label: 'Favoritos' },
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

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  // Safely extract name from nested profile structure
  const displayName = user?.profile?.fullName || user?.profile?.name || user?.email?.split('@')[0] || 'Estudiante';
  const initials = displayName.charAt(0).toUpperCase();
  const university = user?.profile?.university || '';
  const career = user?.profile?.career || '';

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight" style={{ fontFamily: 'Outfit' }}>
            <span className="text-blue-700">Uni</span><span className="text-slate-900">Empleo</span>
          </span>
        </Link>
      </div>

      {/* User card */}
      <div className="px-3 py-3">
        <div className="px-3.5 py-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-100/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 text-sm truncate leading-tight">{displayName}</p>
              <p className="text-xs text-blue-600 font-medium mt-0.5 truncate">
                {career ? career : 'Estudiante'}
              </p>
            </div>
          </div>
          {university && (
            <p className="text-[11px] text-slate-500 mt-2 truncate">{university}</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1 overflow-y-auto py-1">
        {navItems.map((item, idx) => {
          if (item.separator) return <div key={idx} className="my-2 border-t border-slate-100" />;
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all duration-150 ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-slate-400'} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={13} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-100 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-100 shadow-sm flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-white shadow-2xl">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
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
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
          <button
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={19} />
          </button>
          <span className="font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>UniEmpleo</span>
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
