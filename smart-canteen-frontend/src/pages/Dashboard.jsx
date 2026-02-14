import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Clock, ArrowRight, Utensils, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUserOrders } from '../services/orderService';

const Dashboard = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setError(null);
            const response = await getUserOrders(user.id);
            setOrders(response.data || []);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            setError("Could not load your orders. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const servedOrders = orders.filter(o => o.status === 'Served');

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={24} />, color: 'var(--primary)' },
        { label: 'Served Items', value: servedOrders.length, icon: <Utensils size={24} />, color: 'var(--success)' },
        { label: 'Pending Pickups', value: pendingOrders.length, icon: <Clock size={24} />, color: 'var(--warning)' },
    ];

    if (loading) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: '40px', height: '40px', border: '4px solid var(--primary)', borderRadius: '50%', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
            </div>
            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    return (
        <div className="container animate-fade-in">
            <header className="animate-slide-up" style={{ marginBottom: '2rem' }}>
                <h1>Hello, {user?.name || 'Student'}!</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back to your smart canteen dashboard.</p>
            </header>

            {error && (
                <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="card stat-card">
                        <div className="stat-header">
                            <div className="stat-icon" style={{
                                padding: '0.75rem',
                                borderRadius: '50%',
                                backgroundColor: `${stat.color}20`,
                                color: stat.color
                            }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="stat-value" style={{ marginTop: '1rem' }}>{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Recent Activity */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Recent Orders</h3>
                        <Link to="/orders" style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: '500' }}>View All</Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.slice(0, 5).map(order => (
                            <div key={order.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingBottom: '0.75rem',
                                borderBottom: '1px solid var(--bg-accent)',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '500' }}>{order.items.map(i => i.name).join(', ')}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(order.date).toLocaleDateString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold' }}>₹{order.total}</div>
                                    <div style={{
                                        fontSize: '0.75rem',
                                        color: order.status === 'Pending' ? 'var(--warning)' : 'var(--success)',
                                        fontWeight: '600'
                                    }}>{order.status}</div>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && !error && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                                No recent orders.
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions / Featured */}
                <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--primary-light) 100%)' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Hungry?</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Order your favorite food now and skip the queue!
                    </p>
                    <Link to="/menu" className="btn btn-primary" style={{ width: '100%' }}>
                        Order Now <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
