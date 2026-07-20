import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, token, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Verifying session...</p>
            </div>
        );
    }

    if (!token || !user) {
        // Store location to redirect back after successful login
        const loginPath = allowedRoles?.includes('ADMIN')
            ? '/admin/login'
            : allowedRoles?.includes('RECRUITER')
                ? '/recruiter/login'
                : '/candidate/login';
        return <Navigate to={loginPath} state={{ from: location }} replace />;
    }

    // Convert ROLE_ADMIN -> ADMIN, ROLE_RECRUITER -> RECRUITER, ROLE_CANDIDATE -> CANDIDATE
    const userRoleClean = user.role.replace('ROLE_', '');

    if (allowedRoles && !allowedRoles.includes(userRoleClean)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
