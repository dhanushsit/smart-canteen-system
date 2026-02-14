import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, Camera, User, Mail, Phone, MessageSquare, CheckCircle, Loader2 } from 'lucide-react';

const Feedback = () => {
    const { user } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        contact: '',
        message: '',
        photo: '' // Base64 representation of the image
    });

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/complaints', formData);
            setSubmitted(true);
        } catch (error) {
            alert("Failed to submit feedback. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) return (
        <div className="container" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: 'var(--success)15',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem auto'
            }}>
                <CheckCircle size={40} />
            </div>
            <h1>Feedback Submitted!</h1>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '1rem auto' }}>
                Thank you for your feedback. Our team will review your complaint regarding the food quality and take necessary actions.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>
                Send Another Feedback
            </button>
        </div>
    );

    return (
        <div className="container">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1>Send Feedback / Complaint</h1>
                <p style={{ color: 'var(--text-secondary)' }}>We value your feedback to improve our canteen's food quality</p>
            </header>

            <div className="grid-responsive grid-2-1">
                <div className="card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <User size={16} /> Name
                                </label>
                                <input
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    readOnly={!!user?.name}
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={16} /> Email
                                </label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    readOnly={!!user?.email}
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Phone size={16} /> Contact Number
                                </label>
                                <input
                                    required
                                    placeholder="Enter your phone number"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                />
                            </div>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MessageSquare size={16} /> Feedback Details
                                </label>
                                <textarea
                                    required
                                    rows="5"
                                    placeholder="Describe the issue or feedback about the food quality..."
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--bg-accent)', backgroundColor: 'var(--bg-primary)', resize: 'vertical' }}
                                ></textarea>
                            </div>

                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Camera size={16} /> Upload Photo (Food Quality Evidence)
                                </label>
                                <div style={{
                                    border: '2px dashed var(--bg-accent)',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    backgroundColor: formData.photo ? 'transparent' : 'var(--bg-primary)',
                                    overflow: 'hidden'
                                }}>
                                    {formData.photo ? (
                                        <div style={{ position: 'relative' }}>
                                            <img src={formData.photo} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, photo: '' })}
                                                style={{ position: 'absolute', top: '0', right: '0', backgroundColor: 'var(--danger)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Camera size={40} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>Click to upload or drag & drop</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>JPG, PNG or WEBP (Max 5MB)</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                            style={{ width: '100%', marginTop: '2rem', padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            {submitting ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                    </form>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--primary)' }}>
                        <h3 style={{ margin: '0 0 1rem 0' }}>Why provide feedback?</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Your feedback helps us maintain the highest standards of food safety and quality. Every complaint is taken seriously and investigated by our management team.
                        </p>
                    </div>

                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--success)' }}>
                        <h3 style={{ margin: '0 0 1rem 0' }}>Real-time Monitoring</h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                            Admin and staff receive instant notifications when a complaint is registered, ensuring a quick response to any critical issues.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
