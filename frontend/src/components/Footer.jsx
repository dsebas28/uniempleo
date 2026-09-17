import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Linkedin, Twitter, Instagram } from './SocialIcons';
import Logo from './Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <Logo size={34} variant="light" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Conectamos estudiantes universitarios y recién graduados sin experiencia con empresas que valoran el talento joven.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Instagram, href: '#', label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-accent-500 flex items-center justify-center text-slate-400 hover:text-brand-900 transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Para Estudiantes */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Para Estudiantes</h3>
            <ul className="space-y-3">
              {[
                { to: '/empleos', label: 'Buscar empleos' },
                { to: '/practicas', label: 'Prácticas profesionales' },
                { to: '/cursos', label: 'UniEmpleo Academy' },
                { to: '/preparacion', label: 'Preparación entrevistas' },
                { to: '/login/estudiante', label: 'Crear cuenta gratis' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-accent-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Para Empresas */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Para Empresas</h3>
            <ul className="space-y-3">
              {[
                { to: '/registro', label: 'Publicar vacantes' },
                { to: '/login/empresa', label: 'Ingresar como empresa' },
                { to: '/empresas', label: 'Directorio empresas' },
                { to: '/registro', label: 'Registrar empresa' },
              ].map((link, i) => (
                <li key={link.label + i}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate-400 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-accent-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">contacto@uniempleo.co</p>
                  <p className="text-xs text-slate-500">Soporte 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-accent-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">+57 (601) 000-0000</p>
                  <p className="text-xs text-slate-500">Lun – Vie 8am – 6pm</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-accent-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-slate-400">Bogotá, Colombia</p>
                  <p className="text-xs text-slate-500">Sede principal</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {currentYear} UniEmpleo. Todos los derechos reservados. —
            <span className="text-slate-600"> Plataforma de demostración universitaria</span>
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Términos</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
