import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Briefcase, Users, User, LogOut,
  GraduationCap, Menu, X, ChevronRight, PlusCircle, Building2
} from 'lucide-react';

const navItems = [
  { to: '/empresa/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/empresa/vacantes', icon: Briefcase, label: 'Mis Vacantes' },
  { to: '/empresa/vacantes/nueva', icon: PlusCircle, label: 'Publicar Vacante' },
  { to: '/empresa/candidatos', icon: Users, label: 'Candidatos' },
  { to: '/empresa/perfil', icon: User, label: 'Perfil Empresa' },
];

export default function CompanyLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path) => location.pathname === path;

  // Safely read company name from nested profile
  const companyName = user?.profile?.name || user?.profile?.companyName || user?.email?.split('@')[0] || 'Empresa';
  const initials = companyName.charAt(0).toUpperCase();
  const sector = user?.profile?.sector || '';

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

      {/* Company badge */}
      <div className="px-3 py-3">
        <div className="px-3.5 py-3 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-md shadow-blue-200/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate leading-tight">{companyName}</p>
              <p className="text-xs text-blue-200 font-medium mt-0.5">
                {sector ? sector : 'Panel Empresa'}
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5">
            <Building2 size={11} className="text-blue-300" />
            <span className="text-[11px] text-blue-200">Cuenta empresarial verificada</span>
          </div>
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
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-100 shadow-sm flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-white shadow-2xl">
            <button className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-100 shadow-sm">
          <button className="p-2 rounded-lg text-slate-600 hover:bg-slate-100" onClick={() => setSidebarOpen(true)}>
            <Menu size={19} />
          </button>
          <span className="font-bold text-slate-900" style={{ fontFamily: 'Outfit' }}>{companyName}</span>
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
