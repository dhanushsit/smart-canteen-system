/**
 * MAIN APP COMPONENT
 * Handles routing, global state providers (Auth, Cart), and role-based navigation.
 */
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute'; // Middleware for login checks
import DashboardLayout from './layouts/DashboardLayout'; // Side-nav and header wrapper
import Login from './pages/Login';
import Register from './pages/Register';

// Dashboard views for different users
import StudentDashboard from './pages/Dashboard';
import DistributorDashboard from './pages/DistributorDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Feature Pages
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import StockManagement from './pages/StockManagement';
import Payment from './pages/Payment';
import UserManagement from './pages/UserManagement';
import TimingManagement from './pages/TimingManagement';
import Feedback from './pages/Feedback';
import ManageComplaints from './pages/ManageComplaints';
import Landing from './pages/Landing';

// Real-time Handler
import NotificationHandler from './components/NotificationHandler';

/**
 * 404 Component
 */
const NotFound = () => <div style={{ padding: '2rem', textAlign: 'center' }}>404 - Page Not Found</div>;

/**
 * RoleBasedDashboard Component
 * Logic: Checks the user's role and returns the corresponding Dashboard component.
 */
const RoleBasedDashboard = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'distributor') return <DistributorDashboard />;
  return <StudentDashboard />;
};

/**
 * RootRedirector Component
 * Logic: Decides whether to show the Landing page or redirect to Dashboard if already logged in.
 */
const RootRedirector = () => {
  const { user, loading } = useAuth();
  if (loading) return null; // Wait for auth check to finish
  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
};

function App() {
  return (
    <AuthProvider>
      {/* Global WebSocket Notification Listener */}
      <NotificationHandler />

      <CartProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED ROUTES 
              Everything inside <ProtectedRoute> requires a valid JWT token.
          */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<RoleBasedDashboard />} />

              {/* STUDENT ONLY PAGES */}
              <Route path="/menu" element={<Menu />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/feedback" element={<Feedback />} />

              {/* DISTRIBUTOR / ADMIN SHARED PAGES */}
              <Route path="/stock" element={<StockManagement />} />
              <Route path="/timing" element={<TimingManagement />} />

              {/* ADMIN ONLY PAGES */}
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/complaints" element={<ManageComplaints />} />

            </Route>
          </Route>

          {/* Fallback Routes */}
          <Route path="/" element={<RootRedirector />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
