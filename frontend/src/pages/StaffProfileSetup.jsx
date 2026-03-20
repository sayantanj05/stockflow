import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/auth';
import { FiUser, FiPhone, FiMapPin, FiUpload } from 'react-icons/fi';

function StaffProfileSetup() {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();
    
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: ''
    });
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Redirection logic if somehow they are already setup
        if (user && user.setup_completed) {
            navigate(user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard');
        }
    }, [user, navigate]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('phone', formData.phone);
            submitData.append('address', formData.address);
            if (photo) {
                submitData.append('photo', photo);
            }

            const response = await api.post('/staff/setup', submitData);
            
            setSuccess('Profile setup completed successfully! Redirecting...');
            
            // Update local user object
            const updatedUser = { ...user, name: formData.name, setup_completed: true };
            localStorage.setItem('user', JSON.stringify({ user: updatedUser, token: authService.getToken() })); // Update cache
            
            // Redirect to dashboard explicitly instead of profile, or just use /dashboard to rely on roles
            setTimeout(() => {
                navigate('/dashboard', { replace: true });
            }, 1500);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to complete profile setup.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h3 className="fw-bold text-primary mb-2">Complete Your Profile</h3>
                                <p className="text-muted">Please provide your details to finish setting up your staff account.</p>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <form onSubmit={handleSubmit}>
                                {/* Profile Photo Upload */}
                                <div className="text-center mb-4">
                                    <div className="position-relative d-inline-block">
                                        <div 
                                            className="rounded-circle bg-light border d-flex align-items-center justify-content-center overflow-hidden"
                                            style={{ width: '120px', height: '120px', margin: '0 auto' }}
                                        >
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-100 h-100 object-fit-cover" />
                                            ) : (
                                                <FiUser size={50} className="text-muted" />
                                            )}
                                        </div>
                                        <label htmlFor="photoUpload" className="btn btn-sm btn-primary rounded-circle position-absolute bottom-0 end-0 shadow" style={{ width: '32px', height: '32px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FiUpload />
                                        </label>
                                        <input 
                                            type="file" 
                                            id="photoUpload" 
                                            className="d-none" 
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                        />
                                    </div>
                                    <div className="small text-muted mt-2">Optional Profile Photo</div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-muted fw-semibold">Full Name *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FiUser /></span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={formData.name} 
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label text-muted fw-semibold">Phone Number *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FiPhone /></span>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            value={formData.phone} 
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            required 
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-muted fw-semibold">Full Address *</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light"><FiMapPin /></span>
                                        <textarea 
                                            className="form-control" 
                                            rows="3"
                                            value={formData.address} 
                                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                                            required 
                                        ></textarea>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2 fw-bold" 
                                    disabled={loading || success}
                                >
                                    {loading ? (
                                        <><span className="spinner-border spinner-border-sm me-2"></span> Saving Profile...</>
                                    ) : (
                                        'Complete Setup'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffProfileSetup;
