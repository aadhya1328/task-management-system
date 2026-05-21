import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/useAuthStore';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import EmployeeDashboard from './pages/dashboard/EmployeeDashboard';
import { Loader2 } from 'lucide-react';

// Strict Role Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#140e0d]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-sm">Authenticating secure terminal...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If not authorized for this specific portal, bounce to their own home dashboard
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }
  
  return children;
};

// Premium Common Dashboard Shell
const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#140e0d] flex flex-col selection:bg-rose-500/20 selection:text-rose-200">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Smart Redirector for root and generic /dashboard paths
const SmartRedirector = () => {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#140e0d]">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to their respective dashboards
  return <Navigate to={`/${user?.role}/dashboard`} replace />;
};

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Dashboard Protected */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <AdminDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Manager Dashboard Protected */}
        <Route 
          path="/manager/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <DashboardLayout>
                <ManagerDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Employee Dashboard Protected */}
        <Route 
          path="/employee/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['employee', 'manager', 'admin']}>
              <DashboardLayout>
                <EmployeeDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />

        {/* Redirect for catch-all endpoints to smart dashboards */}
        <Route path="/dashboard" element={<SmartRedirector />} />
        <Route path="/" element={<SmartRedirector />} />
        
        {/* Wildcard Fallback */}
        <Route path="*" element={<SmartRedirector />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
