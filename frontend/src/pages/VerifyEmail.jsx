import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import authService from '../services/auth';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email address...');
    
    const user = authService.getCurrentUser();

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token provided.');
                return;
            }

            try {
                const response = await api.post('/verify-email', { token });
                setStatus('success');
                setMessage(response.data.message || 'Email successfully verified!');
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        if (token) {
            verifyToken();
        } else {
            // For local dev, if they just arrive here from login redirect, show a manual verification button
            setStatus('pending_manual');
            setMessage('Please check your email for the verification link.');
        }
    }, [token]);

    const handleDevBypass = async () => {
        if (!user) {
            setMessage("You must be logged in to bypass.");
            return;
        }
        
        // We simulate a backend verification by calling a generic profile update or just hacking the local storage.
        // For a true fix without a backend bypass route, let's just forcefully update local storage and redirect.
        setStatus('success');
        setMessage('Development Bypass: Account Verified!');
        
        const updatedUser = { ...user, is_verified: true };
        localStorage.setItem('user', JSON.stringify({ user: updatedUser, token: authService.getToken() }));
        
        setTimeout(() => {
            navigate('/staff/setup');
        }, 1000);
    };

    const handleContinue = () => {
        if (user) {
            // Force re-login if we don't have a clean way to refresh the JWT in this demo
            const updatedUser = { ...user, is_verified: true };
            // Ensure we keep the token when updating local storage
            localStorage.setItem('user', JSON.stringify({ user: updatedUser, token: authService.getToken() })); 
            navigate('/staff/setup');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-inner text-center">
                <h3 className="fw-bold mb-4 text-primary">Email Verification</h3>
                
                {status === 'verifying' && (
                    <div className="py-4">
                        <div className="spinner-border text-primary mb-3"></div>
                        <p className="text-muted fw-semibold">{message}</p>
                    </div>
                )}
                
                {status === 'pending_manual' && (
                    <div className="py-4">
                        <div className="mb-4">
                            <i className="bi bi-envelope-paper display-1 text-primary opacity-50"></i>
                        </div>
                        <h4 className="fw-bold mb-3">Verify Your Email</h4>
                        <p className="text-muted mb-4">
                            We've sent a verification link to your registered email address. 
                            Please click the link to activate your account.
                        </p>
                        
                        <hr className="my-4"/>
                        <p className="text-muted small mb-2">Since we are in local development testing:</p>
                        <button className="btn btn-warning w-100 fw-bold" onClick={handleDevBypass}>
                            <i className="bi bi-lightning-charge-fill me-1"></i> Dev Bypass Verification
                        </button>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="py-4">
                        <div className="display-4 text-success mb-3">
                            <i className="bi bi-check-circle-fill"></i>✓
                        </div>
                        <h5 className="text-success mb-3">Success!</h5>
                        <p className="text-muted mb-4">{message}</p>
                        <button className="btn btn-primary w-100" onClick={handleContinue}>
                            {user ? 'Continue to Profile Setup' : 'Login Now'}
                        </button>
                    </div>
                )}
                
                {status === 'error' && (
                    <div className="py-4">
                         <div className="display-4 text-danger mb-3">
                            <i className="bi bi-x-circle-fill"></i>✗
                        </div>
                        <h5 className="text-danger mb-3">Verification Failed</h5>
                        <p className="text-muted mb-4">{message}</p>
                        <button className="btn btn-outline-primary w-100" onClick={() => navigate('/login')}>
                            Return to Login
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
