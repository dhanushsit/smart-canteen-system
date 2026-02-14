import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn, KeyRound, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { resetPassword } from "../services/authService";
import '../styles/auth.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isForgot, setIsForgot] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to login.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Please enter your registered email.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            const res = await resetPassword(email, newPassword, confirmPassword);
            setMessage(res.data.message || "Password updated successfully!");

            // Success feedback
            setTimeout(() => {
                setIsForgot(false);
                setNewPassword("");
                setConfirmPassword("");
                setMessage("");
            }, 3000);
        } catch (err) {
            console.error('Frontend Reset Error:', err);
            const errorMsg = err.response?.data?.message || "Server error. Please try again later.";
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (isForgot) {
        return (
            <div className="auth-container">
                <div className="auth-card glass-morphism animate-scale-up" style={{ padding: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)' }}>
                            <KeyRound size={20} />
                        </div>
                        <h2 style={{ margin: 0 }}>Reset Password</h2>
                    </div>
                    <p className="subtitle" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>Enter your registered email to set a new password</p>

                    {error && <div className="error-message" style={{ marginBottom: '1.2rem', padding: '0.85rem' }}>{error}</div>}
                    {message && <div style={{ color: '#10b981', backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: '12px', marginBottom: '1.2rem', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>{message}</div>}

                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={16} /> Registered Email
                            </label>
                            <input
                                type="email"
                                placeholder="name@canteen.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Set New Password</label>
                            <input
                                type="password"
                                placeholder="Min. 6 characters"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                placeholder="Re-type new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary full-width" disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
                        </button>
                    </form>

                    <button
                        onClick={() => { setIsForgot(false); setError(""); setMessage(""); }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            fontSize: '0.85rem',
                            marginTop: '1.5rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            width: '100%',
                            fontWeight: '600',
                            transition: 'color 0.2s'
                        }}
                        className="hover-primary"
                    >
                        <ArrowLeft size={16} /> Back to Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card glass-morphism">
                <h2>Welcome Back</h2>
                <p className="subtitle">Sign in to your canteen account</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="student@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ marginBottom: 0 }}>Password</label>
                            <button
                                type="button"
                                onClick={() => setIsForgot(true)}
                                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}
                            >
                                Forgot Password?
                            </button>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ marginTop: '0.5rem' }}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary full-width">
                        <LogIn size={18} />
                        Sign In
                    </button>
                </form>

                <p className="auth-footer">
                    New student? <Link to="/register">Register as Student</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
