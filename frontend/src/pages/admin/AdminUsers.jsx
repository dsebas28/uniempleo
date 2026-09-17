import { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, ShieldCheck, ShieldAlert, 
  CheckCircle2, XCircle, Loader2, UserCheck, UserX, 
  Calendar, Mail, ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [roleFilter, page]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getUsers({
        role: roleFilter || undefined,
        page,
        limit: 15
      });
      setUsers(res.data?.users || []);
      setTotal(res.data?.total || 0);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      toast.error('No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (user) => {
    const newActiveState = user.active ? 0 : 1;
    try {
      setUpdatingId(user.id);
      await adminAPI.updateUser(user.id, { active: newActiveState });
      toast.success(newActiveState ? 'Usuario activado exitosamente' : 'Usuario desactivado');
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, active: newActiveState } : u));
    } catch (err) {
      console.error('Error al actualizar estado del usuario:', err);
      toast.error('Error al actualizar el estado');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    return u.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.ceil(total / 15) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-brand-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Administra las cuentas registradas en la plataforma, audita roles y controla accesos activos o bloqueados.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-brand-50 border border-brand-100 px-4 py-2 rounded-xl text-xs font-semibold text-brand-700">
          <UserCheck className="w-4 h-4 text-brand-600" />
          <span>{total} Usuarios Totales</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar usuario por correo electrónico..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: '', label: 'Todos' },
            { id: 'student', label: 'Estudiantes' },
            { id: 'company', label: 'Empresas' },
            { id: 'admin', label: 'Administradores' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setRoleFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                roleFilter === tab.id
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-600 animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">Cargando directorio de usuarios...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No se encontraron usuarios</h3>
          <p className="text-xs text-slate-500 mt-1">Intenta con otros términos de búsqueda o selecciona otro rol.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.04] rounded-2xl border border-slate-200/80 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-4">Correo Electrónico</th>
                  <th className="py-3.5 px-4">Rol en Plataforma</th>
                  <th className="py-3.5 px-4">Fecha de Registro</th>
                  <th className="py-3.5 px-4">Estado</th>
                  <th className="py-3.5 px-6 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-mono text-xs text-slate-400">
                      #{u.id}
                    </td>

                    <td className="py-4 px-4 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                          {u.email[0].toUpperCase()}
                        </div>
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {u.role === 'student' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                          Estudiante
                        </span>
                      ) : u.role === 'company' ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                          Empresa
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          Administrador
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      {new Date(u.created_at).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-4 px-4">
                      {u.active ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Bloqueado
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleToggleActive(u)}
                        disabled={updatingId === u.id || u.role === 'admin'}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50 ${
                          u.active
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        }`}
                        title={u.role === 'admin' ? 'No se puede desactivar un administrador' : ''}
                      >
                        {updatingId === u.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : u.active ? (
                          <>
                            <UserX className="w-3.5 h-3.5" />
                            Bloquear
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            Activar
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Página {page} de {totalPages} ({total} usuarios en total)
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
