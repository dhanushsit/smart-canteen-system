import { Link, Navigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
    const { user, loading } = useAuth();

    // If already logged in, redirect to dashboard
    if (!loading && user) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="landing-page" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, var(--bg-primary) 0%, var(--primary-light) 100%)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <nav style={{
                padding: '1.5rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%'
            }}>
                <div className="logo" style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: '"Outfit", sans-serif', letterSpacing: '-0.5px' }}>
                    <Sparkles size={32} className="logo-icon" />
                    <span>CampusCard</span>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link to="/login" className="btn btn-primary">Login</Link>
                </div>
            </nav>

            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem'
            }}>
                <h1 className="animate-slide-up" style={{ fontSize: '3.5rem', marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: '800', letterSpacing: '-1px' }}>
                    Smarter Campus. <span style={{ color: 'var(--primary)' }}>Faster Food.</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '2.5rem' }}>
                    Skip the queue and order your favorite meals directly from your phone. The smarter way to eat at campus.
                </p>
                <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                    Explore Menu <ArrowRight size={20} />
                </Link>

                <div className="features-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1000px',
                    marginTop: '5rem',
                    width: '100%'
                }}>
                    <div className="card glass-morphism">
                        <Zap size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                        <h3>Instant Ordering</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Browse the menu and place your order in seconds.</p>
                    </div>
                    <div className="card glass-morphism">
                        <ShieldCheck size={32} color="var(--success)" style={{ marginBottom: '1rem' }} />
                        <h3>QR Payments</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Secure and direct payments via UPI QR codes.</p>
                    </div>
                    <div className="card glass-morphism">
                        <Clock size={32} color="var(--warning)" style={{ marginBottom: '1rem' }} />
                        <h3>Real-time Tracking</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Get notified exactly when your food is ready for pickup.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Landing;
