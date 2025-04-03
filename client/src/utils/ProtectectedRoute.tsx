import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

type ProtectedRouteProps = {
    children: React.ReactNode;
    allowedRoles: string[];
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const user = useAuthStore((state) => state.user);
    const loading = useAuthStore((state) => state.loading);

    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) return <Navigate to="/login" replace />;

    if (!allowedRoles.includes(user.accountType)) {
        return <Navigate to="/unauthorized" replace />;
    }
    return <>{children}</>
};

export default ProtectedRoute;
