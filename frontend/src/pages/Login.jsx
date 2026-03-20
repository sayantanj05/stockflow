import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/auth';
import { FiMail, FiLock, FiBox } from 'react-icons/fi';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await authService.login(email, password);
            if(data.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/user/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
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
                    <h2 className="fw-bold">Welcome Back</h2>
                    <p className="text-muted">Sign in to manage your inventory</p>
                </div>
                {error && <div className="alert alert-danger py-2">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label text-muted fw-semibold">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light border-end-0"><FiMail /></span>
                            <input 
                                type="email" 
                                className="form-control border-start-0 ps-0" 
                                value={email} onChange={(e)=>setEmail(e.target.value)}
                                required 
                                placeholder="admin@example.com"
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                    <div className="text-center">
                        <span className="text-muted">Don't have an account? </span>
                        <Link to="/register" className="text-primary text-decoration-none fw-semibold">Register Here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
