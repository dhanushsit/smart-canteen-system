import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Box, AlertCircle, RefreshCw, X, Search, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';

const Orders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await getUserOrders(user.id);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'var(--warning)';
            case 'Served': return 'var(--success)';
            case 'Cancelled': return 'var(--danger)';
            default: return 'var(--text-secondary)';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Clock size={16} />;
            case 'Served': return <CheckCircle size={16} />;
            case 'Cancelled': return <AlertCircle size={16} />;
            default: return <Box size={16} />;
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}>Loading orders...</div>;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>

            {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <Box size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="orders-list" style={{ display: 'grid', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order.id} className="card order-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-accent)', paddingBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem' }}>{order.id}</h3>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                        {new Date(order.date).toLocaleString()}
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: `${getStatusColor(order.status)}20`,
                                    color: getStatusColor(order.status),
                                    fontWeight: '600',
                                    fontSize: '0.9rem'
                                }}>
                                    {getStatusIcon(order.status)}
                                    {order.status}
                                </div>
                            </div>

                            <div style={{ padding: '0.5rem 0' }}>
                                {order.items.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                        <span>{item.qty} x {item.name}</span>
                                        <span style={{ color: 'var(--text-secondary)' }}>₹{item.price * item.qty}</span>
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--bg-accent)', paddingTop: '1rem', fontWeight: 'bold' }}>
                                <span>Total Paid</span>
                                <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>₹{order.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
