import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';
import { FiUser, FiMail, FiLock, FiBox } from 'react-icons/fi';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            await authService.register(name, email, password, 'staff');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner">
                <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle mb-3" style={{width: '60px', height: '60px'}}>
                        <FiBox size={30} />
                    </div>
                    <h2 className="fw-bold">Create Account</h2>
                    <p className="text-muted">Join the inventory system</p>
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                {success && <div className="alert alert-success py-2">{success}</div>}
                <form onSubmit={handleRegister}>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-semibold">Full Name</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><FiUser /></span>
                            <input 
                                type="text" 
                                className="form-control border-start-0 ps-0" 
                                value={name} onChange={(e)=>setName(e.target.value)}
                                required 
                                placeholder="Sourav Singh"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-semibold">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><FiMail /></span>
                            <input 
                                type="email" 
                                className="form-control border-start-0 ps-0" 
                                value={email} onChange={(e)=>setEmail(e.target.value)}
                                required 
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-muted fw-semibold">Password</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><FiLock /></span>
                            <input 
                                type="password" 
                                className="form-control border-start-0 ps-0" 
                                value={password} onChange={(e)=>setPassword(e.target.value)}
                                required 
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 py-2 fw-bold mb-3" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Register'}
                    </button>
                    <div className="text-center">
                        <span className="text-muted">Already have an account? </span>
                        <Link to="/login" className="text-primary text-decoration-none fw-semibold">Sign In</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
