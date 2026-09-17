import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase, Bell, User, Menu, X, ChevronDown,
  LogOut, LayoutDashboard, Heart, FileText, Sun, Moon
} from 'lucide-react';
import { notificationsAPI } from '../services/api';
import Logo from './Logo';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const { isAuthenticated, user, logout, isStudent, isCompany, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      notificationsAPI.getAll().then(res => {
        setNotifCount(res.data?.unread || 0);
      }).catch(() => {});
    }
  }, [isAuthenticated, isAdmin, location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isCompany) return '/empresa/dashboard';
    return '/dashboard';
  };

  const navLinks = [
    { to: '/empleos', label: 'Empleos' },
    { to: '/practicas', label: 'Prácticas' },
    { to: '/empresas', label: 'Empresas' },
    { to: '/cursos', label: 'Academy' },
  ];

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || mobileOpen
        ? 'bg-white dark:bg-brand-950 shadow-lg border-b border-slate-200 dark:border-white/10'
        : 'bg-white/95 dark:bg-brand-950/90 backdrop-blur-md border-b border-slate-100 dark:border-white/5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <Logo size={34} className="group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-brand-50 dark:bg-white/10 text-brand-700 dark:text-brand-200 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notifications */}
                {!isAdmin && (
                  <Link
                    to={isCompany ? '/empresa/dashboard' : '/notificaciones'}
                    className="relative p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:text-brand-700 dark:hover:text-white hover:bg-brand-50 dark:hover:bg-white/10 transition-colors"
                  >
                    <Bell size={20} />
                    {notifCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-brand-950 text-xs font-bold rounded-full flex items-center justify-center notif-dot">
                        {notifCount > 9 ? '9+' : notifCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center text-white text-sm font-bold">
                      {(user?.profile?.full_name || user?.fullName || user?.profile?.name || user?.companyName || 'A')?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                      {user?.profile?.full_name || user?.fullName || user?.profile?.name || user?.companyName || 'Admin'}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-brand-950 rounded-xl shadow-xl border border-slate-100 dark:border-white/10 py-2 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-50 dark:border-white/10">
                        <p className="text-xs text-slate-400 dark:text-slate-400 font-medium uppercase tracking-wide">
                          {isStudent ? 'Estudiante' : isCompany ? 'Empresa' : 'Administrador'}
                        </p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                          {user?.profile?.full_name || user?.fullName || user?.profile?.name || user?.companyName || 'Admin'}
                        </p>
                      </div>
                      <Link to={getDashboardLink()} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-white transition-colors">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      {isStudent && (
                        <>
                          <Link to="/perfil" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-white transition-colors">
                            <User size={16} /> Mi perfil
                          </Link>
                          <Link to="/postulaciones" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-white transition-colors">
                            <FileText size={16} /> Postulaciones
                          </Link>
                          <Link to="/favoritos" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-white transition-colors">
                            <Heart size={16} /> Favoritos
                          </Link>
                        </>
                      )}
                      {isCompany && (
                        <>
                          <Link to="/empresa/vacantes" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-white transition-colors">
                            <Briefcase size={16} /> Mis vacantes
                          </Link>
                          <Link to="/empresa/candidatos" className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 hover:text-brand-700 dark:hover:text-white transition-colors">
                            <User size={16} /> Candidatos
                          </Link>
                        </>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-1 border-t border-slate-50 dark:border-white/10"
                      >
                        <LogOut size={16} /> Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-brand-800 dark:text-brand-200 hover:text-brand-900 dark:hover:text-white transition-colors">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="px-5 py-2 text-sm font-bold rounded-lg btn-accent shadow-md">
                  Registrarse gratis
                </Link>
              </>
            )}
          </div>

          {/* Mobile: theme toggle + menu button */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              className="p-2 rounded-lg text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-white/10 bg-white dark:bg-brand-950 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to) ? 'bg-brand-50 dark:bg-white/10 text-brand-700 dark:text-white' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="px-4 pb-4 border-t border-slate-100 dark:border-white/10 pt-3">
            {isAuthenticated ? (
              <div className="space-y-1">
                <Link to={getDashboardLink()} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 transition-colors">
                  <LayoutDashboard size={16} /> Dashboard
                </Link>
                {isStudent && (
                  <>
                    <Link to="/perfil" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 transition-colors">
                      <User size={16} /> Mi perfil
                    </Link>
                    <Link to="/notificaciones" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-brand-50 dark:hover:bg-white/10 transition-colors">
                      <Bell size={16} /> Notificaciones {notifCount > 0 && <span className="ml-auto bg-accent-500 text-brand-950 text-xs px-1.5 py-0.5 rounded-full">{notifCount}</span>}
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} /> Cerrar sesión
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="block text-center px-4 py-3 rounded-lg text-sm font-semibold border border-slate-200 dark:border-white/15 text-brand-800 dark:text-white hover:bg-slate-50 dark:hover:bg-white/10">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="block text-center px-4 py-3 rounded-lg text-sm font-bold btn-accent">
                  Registrarse gratis
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
