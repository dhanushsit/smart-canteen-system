import { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { UserPlus, Edit2, Trash2, Shield, User as UserIcon, Save, X, Mail, ShieldCheck } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });
    const [showAddModal, setShowAddModal] = useState(false);
    const [newForm, setNewForm] = useState({ name: '', email: '', password: 'password123', role: 'student' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch users", error);
            setLoading(false);
        }
    };

    const handleEdit = (user) => {
        setEditingId(user.id);
        setEditForm({ name: user.name, email: user.email, role: user.role });
    };

    const handleUpdate = async (id) => {
        try {
            await updateUser(id, editForm);
            setEditingId(null);
            fetchUsers();
        } catch (error) {
            alert("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (error) {
                alert("Delete failed");
            }
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createUser(newForm);
            setShowAddModal(false);
            setNewForm({ name: '', email: '', password: 'password123', role: 'student' });
            fetchUsers();
        } catch (error) {
            alert(error.response?.data?.message || "Add failed");
        }
    };

    if (loading) return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
            <div className="animate-spin" style={{ width: '40px', height: '40px', border: '4px solid', borderRadius: '50%', borderTopColor: 'transparent', margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem' }}>Loading users database...</p>
        </div>
    );

    return (
        <div className="container">
            <header className="dashboard-header" style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <h1>User Management</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage account access and roles across the system</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)} style={{ whiteSpace: 'nowrap' }}>
                    <UserPlus size={18} /> <span className="hide-mobile">Add New User</span><span className="show-mobile">Add User</span>
                </button>
            </header>

            <div className="card table-responsive" style={{ padding: 0 }}>
                <table>
                    <thead>
                        <tr>
                            <th>User Name</th>
                            <th>Email Address</th>
                            <th>System Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--bg-accent)' }}>
                                <td style={{ padding: '1rem' }}>
                                    {editingId === user.id ? (
                                        <input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--primary)', width: '100%' }}
                                        />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 'bold' }}>
                                                {user.name.charAt(0)}
                                            </div>
                                            <span style={{ fontWeight: '500' }}>{user.name}</span>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {editingId === user.id ? (
                                        <input
                                            value={editForm.email}
                                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--primary)', width: '100%' }}
                                        />
                                    ) : (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                            <Mail size={14} /> {user.email}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {editingId === user.id ? (
                                        <select
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            style={{ padding: '0.5rem', borderRadius: '4px', width: '100%' }}
                                        >
                                            <option value="student">Student</option>
                                            <option value="distributor">Distributor</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span style={{
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '20px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backgroundColor: user.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' : user.role === 'distributor' ? 'rgba(245, 158, 11, 0.1)' : 'var(--bg-accent)',
                                            color: user.role === 'admin' ? 'var(--danger)' : user.role === 'distributor' ? 'var(--warning)' : 'var(--text-secondary)',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px'
                                        }}>
                                            {user.role === 'admin' && <ShieldCheck size={12} />}
                                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                        </span>
                                    )}
                                </td>

                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {editingId === user.id ? (
                                            <>
                                                <button onClick={() => handleUpdate(user.id)} className="btn btn-primary" style={{ padding: '0.4rem' }} title="Save Changes"><Save size={16} /></button>
                                                <button onClick={() => setEditingId(null)} className="btn" style={{ padding: '0.4rem', border: '1px solid var(--bg-accent)' }} title="Cancel"><X size={16} /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => handleEdit(user)} className="btn" style={{ padding: '0.4rem', color: 'var(--primary)', backgroundColor: 'transparent' }} title="Edit User"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete(user.id)} className="btn" style={{ padding: '0.4rem', color: 'var(--danger)', backgroundColor: 'transparent' }} title="Delete User"><Trash2 size={16} /></button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAddModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="card glass-morphism" style={{ width: '400px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Add New User</h2>
                            <button onClick={() => setShowAddModal(false)} className="btn icon-btn"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAdd}>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
                                <input required value={newForm.name} onChange={(e) => setNewForm({ ...newForm, name: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--bg-accent)' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
                                <input required type="email" value={newForm.email} onChange={(e) => setNewForm({ ...newForm, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--bg-accent)' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>System Role</label>
                                <select value={newForm.role} onChange={(e) => setNewForm({ ...newForm, role: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--bg-accent)', backgroundColor: 'var(--bg-primary)' }}>
                                    <option value="student">Student</option>
                                    <option value="distributor">Distributor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div style={{ marginTop: '2rem' }}>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Create Account</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
