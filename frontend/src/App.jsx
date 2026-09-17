import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './routes/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import CompanyLayout from './layouts/CompanyLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import Home from './pages/Home';
import LoginSelect from './pages/auth/LoginSelect';
import LoginStudent from './pages/auth/LoginStudent';
import LoginCompany from './pages/auth/LoginCompany';
import LoginAdmin from './pages/auth/LoginAdmin';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Internships from './pages/Internships';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import CVPreview from './pages/student/CVPreview';
import StudentApplications from './pages/student/Applications';
import StudentSaved from './pages/student/Saved';
import StudentNotifications from './pages/student/Notifications';
import InterviewPrep from './pages/student/InterviewPrep';

// Company pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyMyJobs from './pages/company/MyJobs';
import CompanyNewJob from './pages/company/NewJob';
import CompanyCandidates from './pages/company/Candidates';
import CompanyProfile from './pages/company/CompanyProfile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCompanies from './pages/admin/AdminCompanies';
import AdminJobs from './pages/admin/AdminJobs';
import AdminReports from './pages/admin/AdminReports';

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Public routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/empleos" element={<Jobs />} />
        <Route path="/empleos/:id" element={<JobDetail />} />
        <Route path="/empresas" element={<Companies />} />
        <Route path="/empresas/:id" element={<CompanyDetail />} />
        <Route path="/practicas" element={<Internships />} />
        <Route path="/cursos" element={<Courses />} />
        <Route path="/cursos/:id" element={<CourseDetail />} />
      </Route>

      {/* Auth routes (redirect if already logged in) */}
      <Route path="/login" element={<GuestRoute><LoginSelect /></GuestRoute>} />
      <Route path="/login/estudiante" element={<GuestRoute><LoginStudent /></GuestRoute>} />
      <Route path="/login/empresa" element={<GuestRoute><LoginCompany /></GuestRoute>} />
      <Route path="/login/admin" element={<GuestRoute><LoginAdmin /></GuestRoute>} />
      <Route path="/registro" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Student routes */}
      <Route element={
        <ProtectedRoute roles={['student']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/perfil" element={<StudentProfile />} />
        <Route path="/postulaciones" element={<StudentApplications />} />
        <Route path="/favoritos" element={<StudentSaved />} />
        <Route path="/notificaciones" element={<StudentNotifications />} />
        <Route path="/preparacion" element={<InterviewPrep />} />
      </Route>

      {/* Standalone print view (no sidebar) */}
      <Route path="/perfil/cv" element={
        <ProtectedRoute roles={['student']}>
          <CVPreview />
        </ProtectedRoute>
      } />

      {/* Company routes */}
      <Route element={
        <ProtectedRoute roles={['company']}>
          <CompanyLayout />
        </ProtectedRoute>
      }>
        <Route path="/empresa/dashboard" element={<CompanyDashboard />} />
        <Route path="/empresa/vacantes" element={<CompanyMyJobs />} />
        <Route path="/empresa/vacantes/nueva" element={<CompanyNewJob />} />
        <Route path="/empresa/candidatos" element={<CompanyCandidates />} />
        <Route path="/empresa/perfil" element={<CompanyProfile />} />
      </Route>

      {/* Admin routes */}
      <Route element={
        <ProtectedRoute roles={['admin']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/usuarios" element={<AdminUsers />} />
        <Route path="/admin/empresas" element={<AdminCompanies />} />
        <Route path="/admin/vacantes" element={<AdminJobs />} />
        <Route path="/admin/reportes" element={<AdminReports />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
