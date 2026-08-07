import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Components
import LoginApp from './features/auth/components/LoginApp';

// Institution Components & Pages
import InstitutionLayout from './features/institution/components/InstitutionLayout';
import InstitutionHome from './features/institution/pages/Home';
import InstitutionApplications from './features/institution/pages/Applications';
import InstitutionOpportunities from './features/institution/pages/Opportunities';
import InstitutionAttendance from './features/institution/pages/Attendance';
import InstitutionEvaluations from './features/institution/pages/Evaluations';
import InstitutionProfile from './features/institution/pages/Profile';
import InstitutionSettings from './features/institution/pages/Settings';

// Registrar Components & Pages
import RegistrarLayout from './features/registrar/components/RegistrarLayout';
import RegistrarHome from './features/registrar/pages/Home';
import RegistrarApplications from './features/registrar/pages/Applications';
import RegistrarLetters from './features/registrar/pages/Letters';
import RegistrarUsers from './features/registrar/pages/Users';
import RegistrarCommunications from './features/registrar/pages/Communications';
import RegistrarGrades from './features/registrar/pages/Grades';
import RegistrarReports from './features/registrar/pages/Reports';
import RegistrarSettings from './features/registrar/pages/Settings';
import InstitutionsAdmission from './features/registrar/pages/InstitutionsAdmission';


// Student Components & Pages
import StudentLayout from './features/student/components/StudentLayout';
import StudentHome from './features/student/pages/Home';
import StudentApplied from './features/student/pages/Applied';
import StudentAttendance from './features/student/pages/Attendance';
import StudentReports from './features/student/pages/Reports';
import StudentCertificates from './features/student/pages/Certificates';
import StudentProfile from './features/student/pages/Profile';
import StudentCommunication from './features/student/pages/Communication';
import StudentSettings from './features/student/pages/Settings';
import StudentOpportunities from './features/student/pages/Opportunities';


// Supervisor Components & Pages
import SupervisorLayout from './features/supervisor/components/SupervisorLayout';
import SupervisorHome from './features/supervisor/pages/Home';
import SupervisorApplications from './features/supervisor/pages/Applications';
import SupervisorInstitutions from './features/supervisor/pages/Institutions';
import SupervisorReports from './features/supervisor/pages/Reports';
import SupervisorCommunication from './features/supervisor/pages/Communication';
import SupervisorEvaluation from './features/supervisor/pages/Evaluation';
import SupervisorNotifications from './features/supervisor/pages/Notifications';
import SupervisorProfile from './features/supervisor/pages/Profile';
import SupervisorSettings from './features/supervisor/pages/Settings';
import SupervisorStudentReports from './features/supervisor/pages/StudentReports';

// Route guard for authenticated users
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fd] font-cairo">
        <div className="h-10 w-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-550 font-semibold">جاري التحميل...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
 if (allowedRoles && !allowedRoles.includes(user.role)) {
  const path = roleToPath[user.role];
  return <Navigate to={`/dashboard/${path || 'login'}`} replace />;
}
  
  return children;
}

// Route guard for non-authenticated users
const roleToPath = {
  registrar: 'registrar',
  institution: 'institution',
  student: 'student',
  supervisor: 'supervisor',
};

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fd] font-cairo">
        <div className="h-10 w-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-555 font-semibold">جاري التحميل...</p>
      </div>
    );
  }
  
  const path = roleToPath[user?.role];
  
  if (user && path) {
    return <Navigate to={`/dashboard/${path}`} replace />;
  }
  
  return children;
}

// Redirect helper for root dashboard route
function DashboardRedirect() {
  const { user } = useAuth();
  const path = roleToPath[user?.role];
  return <Navigate to={`/dashboard/${path || 'login'}`} replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginApp />
          </PublicRoute>
        } 
      />

      {/* Protected Routes redirect wrapper */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardRedirect />
          </ProtectedRoute>
        } 
      />

      {/* Institution Dashboard & Pages */}
      <Route 
        path="/dashboard/institution" 
        element={
          <ProtectedRoute allowedRoles={['institution']}>
            <InstitutionLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<InstitutionHome />} />
        <Route path="applications" element={<InstitutionApplications />} />
        <Route path="opportunities" element={<InstitutionOpportunities />} />
        <Route path="attendance" element={<InstitutionAttendance />} />
        <Route path="evaluations" element={<InstitutionEvaluations />} />
        <Route path="profile" element={<InstitutionProfile />} />
        <Route path="settings" element={<InstitutionSettings />} />
      </Route>

      {/* Registrar Dashboard & Pages */}
      <Route 
        path="/dashboard/registrar" 
        element={
          <ProtectedRoute allowedRoles={['registrar']}>
            <RegistrarLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<RegistrarHome />} />
        <Route path="applications" element={<RegistrarApplications />} />
        <Route path="letters" element={<RegistrarLetters />} />
        <Route path="users" element={<RegistrarUsers />} />
        <Route path="communications" element={<RegistrarCommunications />} />
        <Route path="grades" element={<RegistrarGrades />} />
        <Route path="reports" element={<RegistrarReports />} />
        <Route path="settings" element={<RegistrarSettings />} />
        <Route path="institutions" element={<InstitutionsAdmission />} />
      </Route>

      {/* Student Dashboard & Pages */}
      <Route 
        path="/dashboard/student" 
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<StudentHome />} />
        <Route path="opportunities" element={<StudentOpportunities />} />   
        <Route path="applied" element={<StudentApplied />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="reports" element={<StudentReports />} />
        <Route path="certificates" element={<StudentCertificates />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="communication" element={<StudentCommunication />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>


      {/* Supervisor Dashboard & Pages */}
<Route 
  path="/dashboard/supervisor" 
  element={
    <ProtectedRoute allowedRoles={['supervisor']}>
      <SupervisorLayout />
    </ProtectedRoute>
  }
>
  <Route index element={<SupervisorHome />} />
  <Route path="applications" element={<SupervisorApplications />} />
  <Route path="institutions" element={<SupervisorInstitutions />} />
  <Route path="reports" element={<SupervisorReports />} />
  <Route path="communication" element={<SupervisorCommunication />} />
  <Route path="evaluation" element={<SupervisorEvaluation />} />
  <Route path="profile" element={<SupervisorProfile />} />
  <Route path="notifications" element={<SupervisorNotifications />} />
  <Route path="settings" element={<SupervisorSettings />} />
  <Route path="student-reports" element={<SupervisorStudentReports />} />
</Route>

      {/* Fallback routing */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
