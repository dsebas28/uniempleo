import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, Briefcase, BarChart2,
  GraduationCap, LogOut, Menu, X, ChevronRight, Shield
} from 'lucide-react';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/usuarios', icon: Users, label: 'Usuarios' },
  { to: '/admin/empresas', icon: Building2, label: 'Empresas' },
  { to: '/admin/vacantes', icon: Briefcase, label: 'Vacantes' },
  { to: '/admin/reportes', icon: BarChart2, label: 'Reportes' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  // Admin profile name — can be in profile or directly on user
  const adminName = user?.profile?.fullName || user?.email?.split('@')[0] || 'Administrador';
  const adminEmail = user?.email || '';

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-black text-lg tracking-tight" style={{ fontFamily: 'Outfit' }}>
            <span className="text-blue-400">Uni</span><span className="text-white">Empleo</span>
          </span>
        </Link>
      </div>

      {/* Admin badge */}
      <div className="px-3 py-3">
        <div className="px-3.5 py-3 rounded-2xl bg-slate-800 border border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <Shield size={17} className="text-blue-400" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate leading-tight">{adminName}</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Administrador del sistema</p>
            </div>
          </div>
          {adminEmail && (
            <p className="text-[11px] text-slate-500 mt-2 truncate">{adminEmail}</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 flex-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all duration-150 ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/50'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={16} className={active ? 'text-white' : 'text-slate-500'} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={13} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 transition-colors duration-150"
        >
          <LogOut size={16} /> Cerrar sesión
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <aside className="hidden md:flex flex-col w-60 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-slate-900 shadow-2xl">
            <button className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 border-b border-slate-800">
          <button className="p-2 rounded-lg text-slate-400 hover:bg-slate-800" onClick={() => setSidebarOpen(true)}>
            <Menu size={19} />
          </button>
          <span className="font-bold text-white" style={{ fontFamily: 'Outfit' }}>Panel Admin</span>
        </div>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
