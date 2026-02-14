import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // Prevent any flashes of protected content while checking auth status
    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '1rem',
                color: 'var(--primary)'
            }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid', borderRadius: '50%', borderTopColor: 'transparent' }}></div>
                <span>Securing your session...</span>
            </div>
        );
    }

    // If no user, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check specific role permissions if required
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
