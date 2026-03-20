import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="top-navbar">
            <h4 className="m-0 text-dark fw-bold">{user?.role === 'admin' ? 'Admin Portal' : 'Staff Portal'}</h4>
            <div className="d-flex align-items-center">
                <div className="dropdown">
                    <button className="btn btn-light dropdown-toggle d-flex align-items-center gap-2 border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{width: '35px', height: '35px'}}>
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="fw-semibold text-dark">{user?.name}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                        <li className="px-3 py-2 text-muted border-bottom mb-2">
                            <small className="d-block">Signed in as</small>
                            <span className="fw-bold text-dark">{user?.email}</span>
                        </li>
                        <li><a className="dropdown-item py-2" href="#"><FiUser className="me-2" /> Profile</a></li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item py-2 text-danger fw-semibold" onClick={handleLogout}><FiLogOut className="me-2" /> Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
