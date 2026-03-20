import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FiEdit2, FiTrash2, FiUsers, FiUserCheck, FiUserX } from 'react-icons/fi';

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [currentUser, setCurrentUser] = useState({ id: '', name: '', role: 'staff', password: '' });
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (user = null) => {
        setError('');
        if (user) {
            setCurrentUser({ ...user, password: '' }); // Don't fetch/show password
        } else {
            setCurrentUser({ id: '', name: '', role: 'staff', password: '' });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormLoading(true);
        setError('');

        try {
            if (currentUser.id) {
                // Update User
                await api.put(`/users/${currentUser.id}`, currentUser);
            } else {
                // This shouldn't be reached as we use auth register for creation, but can handle if needed
                alert("Please use the main register page or implement a direct add logic. (Using Register UI currently limits scope)");
            }
            fetchUsers();
            handleCloseModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update user');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to remove this user? This cannot be undone.")) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
            } catch (error) {
                console.error("Failed to delete user", error);
                alert("Failed to delete user.");
            }
        }
    };

    const handleVerify = async (id) => {
        if (window.confirm("Are you sure you want to manually verify this user? They will bypass email verification.")) {
            try {
                await api.put(`/users/${id}`, { action: 'verify' });
                fetchUsers();
            } catch (error) {
                console.error("Failed to verify user", error);
                alert(error.response?.data?.message || "Failed to verify user.");
            }
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0"><FiUsers className="me-2 text-primary" /> User Management</h4>
                <div className="text-muted small">Manage system access roles</div>
            </div>

            <div className="custom-table-container">
                {loading ? (
                    <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>Staff ID</th>
                                    <th>Title/Name</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Role</th>
                                    <th className="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id}>
                                        <td className="fw-bold text-secondary">
                                            {u.staff_id || <span className="text-muted small">Pending setup</span>}
                                        </td>
                                        <td className="fw-semibold text-dark">{u.name}</td>
                                        <td className="text-muted">{u.email}</td>
                                        <td>{u.phone || <span className="text-muted small">-</span>}</td>
                                        <td>
                                            <span className={`badge ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <button className="btn btn-sm btn-light me-2 text-primary" onClick={() => handleOpenModal(u)} title="Edit User">
                                                <FiEdit2 /> Edit
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(u.id)} title="Delete User">
                                                <FiTrash2 />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow">
                                <form onSubmit={handleSubmit}>
                                    <div className="modal-header border-bottom-0 pb-0">
                                        <h5 className="modal-title fw-bold">Edit User Details</h5>
                                        <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                                    </div>
                                    <div className="modal-body">
                                        {error && <div className="alert alert-danger py-2">{error}</div>}
                                        <div className="alert alert-info py-2 small border-0 bg-light text-muted">
                                            Note: For security reasons, email addresses cannot be changed here.
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">Name</label>
                                            <input 
                                                type="text" className="form-control" required
                                                value={currentUser.name}
                                                onChange={(e) => setCurrentUser({...currentUser, name: e.target.value})}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">Role</label>
                                            <select className="form-select" value={currentUser.role}
                                                onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="staff">Staff</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-muted fw-semibold">New Password (optional)</label>
                                            <input 
                                                type="password" className="form-control" placeholder="Leave blank to keep current password"
                                                value={currentUser.password}
                                                onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                                            />
                                        </div>
                                    </div>
                                    <div className="modal-footer border-top-0 pt-0">
                                        <button type="button" className="btn btn-light px-4" onClick={handleCloseModal}>Cancel</button>
                                        <button type="submit" className="btn btn-primary px-4" disabled={formLoading}>
                                            {formLoading ? 'Saving...' : 'Update User'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Users;
