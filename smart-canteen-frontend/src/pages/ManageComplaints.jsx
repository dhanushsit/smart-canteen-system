import { useState, useEffect } from 'react';
import api from '../services/api';
import { MessageSquare, Trash2, Calendar, User, Mail, Phone, Camera, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const response = await api.get('/complaints');
            setComplaints(response.data);
        } catch (error) {
            console.error("Failed to fetch complaints", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this complaint?")) {
            try {
                await api.delete(`/complaints/${id}`);
                setComplaints(complaints.filter(c => c.id !== id));
                if (selectedComplaint?.id === id) setSelectedComplaint(null);
            } catch (error) {
                alert("Failed to delete complaint");
            }
        }
    };

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', padding: '5rem' }}>
            <Loader2 className="animate-spin" style={{ margin: '0 auto' }} size={40} />
            <p style={{ marginTop: '1rem' }}>Loading complaints...</p>
        </div>
    );

    return (
        <div className="container">
            <header style={{ marginBottom: '2.5rem' }}>
                <h1>Manage Complaints</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Review and respond to food quality feedback from students</p>
            </header>

            <div className="grid-responsive grid-1-2">
                <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'fit-content' }}>
                    <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--bg-accent)', backgroundColor: 'var(--bg-secondary)', fontWeight: 'bold' }}>
                        All Complaints ({complaints.length})
                    </div>
                    <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                        {complaints.length === 0 ? (
                            <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                <AlertCircle size={32} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                <p>No complaints found</p>
                            </div>
                        ) : (
                            complaints.map((c) => (
                                <div
                                    key={c.id}
                                    onClick={() => setSelectedComplaint(c)}
                                    style={{
                                        padding: '1.25rem 1.5rem',
                                        borderBottom: '1px solid var(--bg-accent)',
                                        cursor: 'pointer',
                                        backgroundColor: selectedComplaint?.id === c.id ? 'var(--primary-light)' : 'transparent',
                                        borderLeft: selectedComplaint?.id === c.id ? '4px solid var(--primary)' : '4px solid transparent',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '600', fontSize: '0.95rem' }}>{c.name}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(c.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '0.85rem',
                                        color: 'var(--text-secondary)',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {c.message}
                                    </p>
                                    {c.photo && (
                                        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--primary)' }}>
                                            <Camera size={14} /> Attachment Included
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    {selectedComplaint ? (
                        <div className="card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    <h2 style={{ margin: 0 }}>Complaint Details</h2>
                                    <span className="badge" style={{ marginTop: '0.5rem', backgroundColor: 'var(--bg-accent)' }}>{selectedComplaint.id}</span>
                                </div>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleDelete(selectedComplaint.id)}
                                    style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ color: 'var(--primary)' }}><User size={20} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Student Name</div>
                                        <div style={{ fontWeight: '600' }}>{selectedComplaint.name}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ color: 'var(--primary)' }}><Mail size={20} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Address</div>
                                        <div style={{ fontWeight: '600' }}>{selectedComplaint.email}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ color: 'var(--primary)' }}><Phone size={20} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact Number</div>
                                        <div style={{ fontWeight: '600' }}>{selectedComplaint.contact}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <div style={{ color: 'var(--primary)' }}><Calendar size={20} /></div>
                                    <div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submission Date</div>
                                        <div style={{ fontWeight: '600' }}>{new Date(selectedComplaint.date).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Complaint Message</div>
                                <div style={{
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    backgroundColor: 'var(--bg-secondary)',
                                    lineHeight: '1.6',
                                    color: 'var(--text-primary)',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {selectedComplaint.message}
                                </div>
                            </div>

                            {selectedComplaint.photo && (
                                <div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Photo Evidence</div>
                                    <div style={{ position: 'relative', width: 'fit-content' }}>
                                        <img
                                            src={selectedComplaint.photo}
                                            alt="Evidence"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '400px',
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                            }}
                                        />
                                        <a
                                            href={selectedComplaint.photo}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                position: 'absolute',
                                                bottom: '1rem',
                                                right: '1rem',
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                padding: '0.5rem',
                                                borderRadius: '50%',
                                                color: 'var(--primary)',
                                                display: 'flex'
                                            }}
                                            title="View Full Size"
                                        >
                                            <ExternalLink size={20} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                            <MessageSquare size={64} style={{ marginBottom: '1.5rem', opacity: 0.2 }} />
                            <h2>Full Details</h2>
                            <p>Select a complaint from the list to view full details and evidence</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageComplaints;
