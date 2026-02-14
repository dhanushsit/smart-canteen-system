import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Loader2, Smartphone, User, Lock, Mail } from "lucide-react";
import { register } from "../services/authService";
import '../styles/auth.css';

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Indian Phone Internal Validation
        const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            setError("Please enter a valid Indian mobile number (10 digits starting with 6-9)");
            return;
        }

        setLoading(true);

        try {
            await register(name, email, phone, password);
            alert("Registration successful! Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass-morphism">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)' }}>
                        <Smartphone size={20} />
                    </div>
                    <h2 style={{ margin: 0 }}>Register</h2>
                </div>
                <p className="subtitle">Create your canteen account</p>

                {error && <div className="error-message" style={{ color: 'var(--danger)', marginBottom: '1.2rem', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={16} /> Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Alex Morgan"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Mail size={16} /> Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="alex@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Smartphone size={16} /> Mobile Number
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '800', color: 'var(--primary)', fontSize: '0.9rem' }}>+91</span>
                            <input
                                type="tel"
                                placeholder="98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                required
                                style={{ paddingLeft: '3.5rem', fontWeight: '600' }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Lock size={16} /> Secure Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary full-width" disabled={loading} style={{ marginTop: '0.5rem' }}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <span>Create Account</span>}
                    </button>
                </form>

                <p className="auth-footer">
                    Joined already? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
