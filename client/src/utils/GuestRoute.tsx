import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../stores/useAuthStore";

interface GuestRouteProps {
    children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
    const { user } = useAuthStore();

    if (user) {
        return <Navigate to="/dashboard/profile" replace />; // Redirect to the home page or dashboard
    }

    return <>{children}</>;
};

export default GuestRoute;
