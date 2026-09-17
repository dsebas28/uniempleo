import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function loginPathFor(pathname) {
  if (pathname.startsWith('/admin')) return '/login/admin';
  if (pathname.startsWith('/empresa')) return '/login/empresa';
  return '/login/estudiante';
}

export function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={loginPathFor(location.pathname)} state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'company') return <Navigate to="/empresa/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin" replace />;
    if (user?.role === 'company') return <Navigate to="/empresa/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
