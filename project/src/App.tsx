import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EmailVerification from './components/auth/EmailVerification';
import AdminDashboard from './components/dashboards/AdminDashboard';
import CoachDashboard from './components/dashboards/CoachDashboard';
import UserDashboard from './components/dashboards/UserDashboard';
import Payment from './components/Payment';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { user, isAuthenticated } = useAuth();
  
  const getDashboardRoute = () => {
    if (!isAuthenticated || !user) return '/';
    
    switch (user.role) {
      case 'admin':
        return '/admin';
      case 'coach':
        return '/coach';
      case 'user':
        return '/dashboard';
      case 'bidder':
        return '/dashboard';
      default:
        return '/';
    }
  };

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<EmailVerification />} />
      <Route path="/payment" element={<Payment />} />
      
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/coach" 
        element={
          <ProtectedRoute allowedRoles={['coach']}>
            <CoachDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user', 'bidder']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/redirect" 
        element={<Navigate to={getDashboardRoute()} replace />} 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;