import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/auth';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import Stock from './pages/Stock';
import Purchases from './pages/Purchases';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Messages from './pages/Messages';
import VerifyEmail from './pages/VerifyEmail';
import StaffProfileSetup from './pages/StaffProfileSetup';
import StaffProfile from './pages/StaffProfile';
import LandingPage from './pages/LandingPage';

// Component
import Layout from './components/Layout';

const AuthGuard = ({ children }) => {
    const user = authService.getCurrentUser();
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const PublicRoute = ({ children }) => {
    const user = authService.getCurrentUser();
    
    // Redirect logged in users to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }
    return children;
};

const DashboardRedirect = () => {
    const user = authService.getCurrentUser();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Protected Routes */}
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          
          {/* Default Dashboard Redirection Base for App */}
          <Route path="/dashboard" element={<DashboardRedirect />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute roles={['admin']}><Categories /></ProtectedRoute>} />
          <Route path="/admin/suppliers" element={<ProtectedRoute roles={['admin']}><Suppliers /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><Products /></ProtectedRoute>} />
          <Route path="/admin/stock" element={<ProtectedRoute roles={['admin']}><Stock /></ProtectedRoute>} />
          <Route path="/admin/purchases" element={<ProtectedRoute roles={['admin']}><Purchases /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><Users /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>} />
          <Route path="/admin/messages" element={<ProtectedRoute roles={['admin']}><Messages /></ProtectedRoute>} />

          {/* User Routes */}
          <Route path="/user/dashboard" element={<ProtectedRoute roles={['staff']}><UserDashboard /></ProtectedRoute>} />
          <Route path="/user/products" element={<ProtectedRoute roles={['staff']}><Products /></ProtectedRoute>} />
          
          {/* Setup and Profile Routes */}
          <Route path="/staff/setup" element={<ProtectedRoute roles={['setup']}><StaffProfileSetup /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute roles={['admin', 'staff', 'profile']}><StaffProfile /></ProtectedRoute>} />
          
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
