import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Sparkles,
    ShoppingBag,
    User,
    LogOut,
    Package,
    Clock,
    Users,
    Utensils,
    MessageSquare,
    AlertCircle,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    const links = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} />, roles: ['student', 'distributor', 'admin'] },
        { name: 'Menu', path: '/menu', icon: <Utensils size={20} />, roles: ['student'] },
        { name: 'My Orders', path: '/orders', icon: <ShoppingBag size={20} />, roles: ['student'] },
        { name: 'Feedback', path: '/feedback', icon: <MessageSquare size={20} />, roles: ['student'] },
        { name: 'Timing Hub', path: '/timing', icon: <Clock size={20} />, roles: ['distributor', 'admin'] },
        { name: 'Inventory', path: '/stock', icon: <Package size={20} />, roles: ['distributor', 'admin'] },
        { name: 'Complaint Management', path: '/complaints', icon: <AlertCircle size={20} />, roles: ['admin'] },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} />, roles: ['admin'] },
    ];

    const filteredLinks = links.filter(link => link.roles.includes(user?.role));

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={toggleSidebar}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '2rem' }}>
                    <div className="logo" style={{ marginBottom: 0 }}>
                        <Sparkles size={32} className="logo-icon" />
                        <span style={{ fontFamily: '"Outfit", sans-serif', fontWeight: '800', letterSpacing: '-0.5px', fontSize: '1.4rem' }}>CampusCard</span>
                    </div>
                </div>

                <nav className="nav-links">
                    {filteredLinks.map((link) => (
                        <Link
                            key={link.path + link.name}
                            to={link.path}
                            className={`nav-item ${isActive(link.path)}`}
                            onClick={() => window.innerWidth < 1024 && toggleSidebar()} // Auto close on mobile click
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="user-profile">
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.2rem'
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="btn icon-btn"
                        title="Logout"
                        style={{ color: 'var(--danger)', padding: '0.5rem' }}
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
