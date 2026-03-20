import React, { useState, useEffect } from 'react';
import api from '../services/api';
import authService from '../services/auth';
import { FiUser, FiMail, FiPhone, FiMapPin, FiHash, FiShield, FiUpload } from 'react-icons/fi';

function StaffProfile() {
    const user = authService.getCurrentUser();
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        password: ''
    });
    
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/staff/profile');
                setProfile(response.data);
                setFormData({
                    name: response.data.name || '',
                    phone: response.data.phone || '',
                    address: response.data.address || '',
                    password: ''
                });
                if (response.data.photo) {
                    // Update preview with base API URL handling if needed
                    // we assume backend runs on same domain for this demo or we use full url
                    setPreviewUrl('http://localhost/inventory-system/backend' + response.data.photo);
                    // Since we are using port 8000 for local testing instead of full XAMPP path:
                    setPreviewUrl('http://localhost:8000' + response.data.photo);
                }
            } catch (err) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('phone', formData.phone);
            submitData.append('address', formData.address);
            if (formData.password) {
                submitData.append('password', formData.password);
            }
            if (photo) {
                submitData.append('photo', photo);
            }

            await api.post('/staff/profile', submitData);
            
            setSuccess('Profile updated successfully!');
            setFormData(prev => ({...prev, password: ''}));
            
            // Update local user name if changed
            if (user.name !== formData.name) {
                const updatedUser = { ...user, name: formData.name };
                localStorage.setItem('user', JSON.stringify({ user: updatedUser, token: authService.getToken() }));
                window.dispatchEvent(new Event('storage')); // trigger update for other components
            }
            
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
    
    // Safety check against crashes if API fails and profile remains null
    if (!profile && error) return <div className="alert alert-danger m-4 text-center">{error}</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0">My Profile</h4>
                <span className="badge bg-primary fs-6 px-3 py-2 rounded-pill shadow-sm">
                    <FiHash className="me-1"/> {profile?.staff_id}
                </span>
            </div>

            <div className="row">
                <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body text-center p-4">
                            <div className="position-relative d-inline-block mb-3">
                                <div 
                                    className="rounded-circle bg-light border d-flex align-items-center justify-content-center overflow-hidden mx-auto"
                                    style={{ width: '150px', height: '150px' }}
                                >
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Profile" className="w-100 h-100 object-fit-cover" />
                                    ) : (
                                        <FiUser size={60} className="text-muted" />
                                    )}
                                </div>
                                <label htmlFor="profilePhoto" className="btn btn-primary rounded-circle position-absolute bottom-0 end-0 shadow" style={{ width: '40px', height: '40px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                    <FiUpload size={18} />
                                </label>
                                <input type="file" id="profilePhoto" className="d-none" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                            
                            <h4 className="fw-bold text-dark">{profile?.name || user?.name}</h4>
                            <p className="text-muted fw-semibold mb-3">{profile?.role?.toUpperCase() || user?.role?.toUpperCase()}</p>
                            
                            <hr className="my-3 border-light" />
                            
                            <div className="d-flex align-items-center justify-content-start text-start mb-2 px-2">
                                <div className="icon-box icon-blue me-3" style={{width: '40px', height:'40px', fontSize: '18px'}}><FiMail /></div>
                                <div>
                                    <small className="text-muted d-block">Email Address</small>
                                    <span className="fw-semibold">{profile?.email}</span>
                                </div>
                            </div>
                            
                            <div className="d-flex align-items-center justify-content-start text-start mb-2 px-2">
                                <div className="icon-box icon-green me-3" style={{width: '40px', height:'40px', fontSize: '18px'}}><FiShield /></div>
                                <div>
                                    <small className="text-muted d-block">Status</small>
                                    <span className="badge bg-success">Verified</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8 mb-4">
                    <div className="card border-0 shadow-sm rounded-4 h-100">
                        <div className="card-body p-4">
                            <h5 className="fw-bold mb-4 text-dark border-bottom pb-2">Edit Information</h5>
                            
                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label text-muted fw-semibold">Full Name</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><FiUser /></span>
                                            <input type="text" className="form-control" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label text-muted fw-semibold">Phone Number</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><FiPhone /></span>
                                            <input type="text" className="form-control" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                                        </div>
                                    </div>
                                    
                                    <div className="col-12 mb-3">
                                        <label className="form-label text-muted fw-semibold">Address</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light"><FiMapPin /></span>
                                            <textarea className="form-control" rows="2" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
                                        </div>
                                    </div>
                                </div>

                                <h5 className="fw-bold mb-3 mt-4 text-dark border-bottom pb-2">Change Password</h5>
                                <div className="row">
                                    <div className="col-md-12 mb-4">
                                        <label className="form-label text-muted fw-semibold">New Password (leave blank to keep current)</label>
                                        <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Enter new password" />
                                    </div>
                                </div>

                                <div className="text-end">
                                    <button type="submit" className="btn btn-primary px-4 py-2" disabled={saving}>
                                        {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StaffProfile;
