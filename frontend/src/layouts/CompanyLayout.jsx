import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import Avatar from '../components/ui/Avatar';
import {
  LayoutDashboard, Briefcase, Users, User, LogOut,
  Menu, X, ChevronRight, PlusCircle, BadgeCheck
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

  // El backend anida el perfil de empresa bajo `profile` (columna `name`).
  const companyName = user?.profile?.name || user?.companyName || user?.email?.split('@')[0] || 'Empresa';
  const sector = user?.profile?.sector || '';
  const logo = user?.profile?.logo;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-slate-100 dark:border-white/10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo size={30} className="group-hover:opacity-90 transition-opacity" />
        </Link>
      </div>

      {/* Company badge — acento esmeralda (identidad del rol Empresa) */}
      <div className="px-3 py-3">
        <div className="px-3.5 py-3 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 text-white shadow-md shadow-accent-900/20">
          <div className="flex items-center gap-2.5">
            <Avatar name={companyName} src={logo} size="md" className="ring-2 ring-white/20" />
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate leading-tight">{companyName}</p>
              <p className="text-xs text-accent-100 font-medium mt-0.5 truncate">
                {sector || 'Panel Empresa'}
              </p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center gap-1.5">
            <BadgeCheck size={12} className="text-accent-200" />
            <span className="text-[11px] text-accent-100">Cuenta empresarial verificada</span>
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
                  ? 'bg-accent-50 dark:bg-accent-500/15 text-accent-700 dark:text-accent-200 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={16} className={active ? 'text-accent-600 dark:text-accent-300' : 'text-slate-400 dark:text-slate-500'} />
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
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-[#111827] border-r border-slate-100 dark:border-white/10 shadow-sm flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative flex flex-col w-72 bg-white dark:bg-[#111827] shadow-2xl">
            <button className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setSidebarOpen(false)}>
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-white/10 shadow-sm">
          <button className="md:hidden p-2 -ml-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10" onClick={() => setSidebarOpen(true)}>
            <Menu size={19} />
          </button>
          <span className="font-display font-bold text-slate-900 dark:text-white truncate">{companyName}</span>
          <div className="ml-auto">
            <Avatar name={companyName} src={logo} size="sm" />
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
