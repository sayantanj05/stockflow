import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/auth';

const ProtectedRoute = ({ children, roles }) => {
    const user = authService.getCurrentUser();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Special routes that bypass normal setup checks
    const isSetupRoute = roles && roles.includes('setup');
    const isProfileRoute = roles && roles.includes('profile');

    if (!isSetupRoute) {
        if (!user.setup_completed && !isProfileRoute) {
            return <Navigate to="/staff/setup" replace />;
        }
    }

    if (roles && roles.length > 0 && !roles.includes(user.role) && !isSetupRoute && !isProfileRoute) {
        // user's role is not authorized for this route
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
