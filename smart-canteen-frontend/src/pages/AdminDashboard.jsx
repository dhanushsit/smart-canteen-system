import { useState, useEffect } from 'react';
import { getAllOrders } from '../services/orderService';
import { getProducts } from '../services/productService';
import { getUsers } from '../services/userService';
import { TrendingUp, Users, DollarSign, PieChart as PieChartIcon, ArrowRight, UserCheck, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                const [oRes, pRes, uRes] = await Promise.all([
                    getAllOrders(),
                    getProducts(),
                    getUsers()
                ]);
                setOrders(oRes.data);
                setProducts(pRes.data);
                setUsers(uRes.data);
            } catch (err) {
                console.error("Failed to load admin data", err);
            }
        };
        loadData();
    }, []);

    const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);

    // Process data for charts
    const salesByCategory = orders.reduce((acc, order) => {
        order.items.forEach(item => {
            const cat = products.find(p => p.name === item.name)?.category || 'Other';
            acc[cat] = (acc[cat] || 0) + (item.price * item.qty);
        });
        return acc;
    }, {});

    const chartData = Object.keys(salesByCategory).map(name => ({
        name,
        value: salesByCategory[name]
    }));

    const COLORS = ['var(--primary)', 'var(--success)', 'var(--warning)', 'var(--danger)', 'var(--primary-dark)'];

    const stats = [
        { label: 'Total Revenue', value: `₹${totalRevenue}`, icon: <DollarSign size={24} />, color: 'var(--success)' },
        { label: 'Total Orders', value: orders.length, icon: <TrendingUp size={24} />, color: 'var(--primary)' },
        { label: 'Total Signups', value: users.length, icon: <Users size={24} />, color: 'var(--warning)' },
    ];

    return (
        <div className="container animate-fade-in">
            <header className="dashboard-header" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <h1>Admin Analytics</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Live system performance tracking</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ border: '1px solid var(--bg-accent)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-secondary)' }} onClick={() => navigate('/admin/users')}>
                        <UserCheck size={18} /> <span className="hide-mobile">User Management</span><span className="show-mobile">Users</span>
                    </button>
                </div>
            </header>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="card stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div className="stat-icon" style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="stat-value" style={{ marginTop: '1rem' }}>{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1.5rem' }}>Revenue Breakdown by Category</h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3>Recent Global Orders</h3>
                        <Link to="/stock" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>View All Orders</Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {orders.slice(0, 6).map(order => (
                            <div key={order.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                borderBottom: '1px solid var(--bg-accent)',
                                paddingBottom: '0.75rem',
                                flexWrap: 'wrap',
                                gap: '0.5rem'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{order.id}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(order.date).toLocaleTimeString()}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>₹{order.total}</div>
                                    <span style={{
                                        fontSize: '0.7rem',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        backgroundColor: order.status === 'Served' ? 'var(--success)15' : 'var(--warning)15',
                                        color: order.status === 'Served' ? 'var(--success)' : 'var(--warning)',
                                        fontWeight: '600'
                                    }}>{order.status}</span>
                                </div>
                            </div>
                        ))}
                        {orders.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No orders yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
