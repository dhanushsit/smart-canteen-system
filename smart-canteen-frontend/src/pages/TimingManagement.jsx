import { useState, useEffect } from 'react';
import api from '../services/api';
import { Clock, CheckCircle, XCircle, Coffee, Sun, Moon, Loader2, Package } from 'lucide-react';

const TimingManagement = () => {
    const [settings, setSettings] = useState({ breakfast: true, lunch: true, dinner: true });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/settings');
            setSettings(response.data);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (meal) => {
        setUpdating(true);
        try {
            const newValue = !settings[meal];
            const response = await api.patch('/settings', { [meal]: newValue });
            setSettings(response.data);
        } catch (error) {
            alert("Failed to update meal timing");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto' }} size={40} />
            <p style={{ marginTop: '1rem' }}>Loading timing settings...</p>
        </div>
    );

    const mealTypes = [
        { key: 'breakfast', label: 'Breakfast', icon: <Coffee size={24} />, color: '#f59e0b', description: 'Idli, Dosa, Poha, etc.' },
        { key: 'lunch', label: 'Lunch', icon: <Sun size={24} />, color: '#10b981', description: 'Biryani, Meals, Thali, etc.' },
        { key: 'dinner', label: 'Dinner', icon: <Moon size={24} />, color: '#6366f1', description: 'Chapathi, Dosa, Fried Rice, etc.' },
        { key: 'snacks', label: 'Snacks', icon: <Package size={24} />, color: '#ec4899', description: 'Samosa, Vada Pav, Tea, etc.' }
    ];

    return (
        <div className="container">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1>Timing Management</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Enable or disable food categories based on the current time of day</p>
            </header>

            <div className="card" style={{ maxWidth: '800px' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--bg-accent)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Clock size={20} color="var(--primary)" />
                    <h3 style={{ margin: 0 }}>Meal Category Accessibility</h3>
                </div>

                <div style={{ padding: '1rem' }}>
                    {mealTypes.map((meal) => (
                        <div key={meal.key} className="timing-item">
                            <div className="timing-info">
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: `${meal.color}15`,
                                    color: meal.color,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {meal.icon}
                                </div>
                                <div>
                                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{meal.label}</h4>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{meal.description}</p>
                                </div>
                            </div>

                            <div className="timing-actions">
                                <button
                                    onClick={() => handleToggle(meal.key)}
                                    disabled={updating}
                                    style={{
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '30px',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        minWidth: '120px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        justifyContent: 'center',
                                        border: 'none',
                                        background: settings[meal.key]
                                            ? 'linear-gradient(135deg, var(--success) 0%, #059669 100%)'
                                            : 'var(--bg-accent)',
                                        color: settings[meal.key] ? 'white' : 'var(--text-secondary)',
                                        boxShadow: settings[meal.key]
                                            ? '0 4px 12px rgba(16, 185, 129, 0.3)'
                                            : 'inset 0 2px 4px rgba(0,0,0,0.05)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        cursor: updating ? 'wait' : 'pointer'
                                    }}
                                >
                                    {updating ? <Loader2 size={18} className="animate-spin" /> : (
                                        <>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                background: settings[meal.key] ? 'white' : 'var(--text-muted)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: settings[meal.key] ? 1 : 0.5
                                            }}>
                                                {settings[meal.key] ? <CheckCircle size={14} color="var(--success)" /> : <XCircle size={14} color="white" />}
                                            </div>
                                            <span>{settings[meal.key] ? 'Enabled' : 'Disabled'}</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)30', maxWidth: '800px' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <CheckCircle size={24} style={{ flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
                        <strong>Note:</strong> Disabling a meal category will immediately hide all items tagged with that meal type from the student menu. Items tagged with multiple categories (e.g., Breakfast and Lunch) will remain visible as long as at least one of their categories is enabled.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimingManagement;
