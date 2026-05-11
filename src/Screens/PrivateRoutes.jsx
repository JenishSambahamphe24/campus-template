import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContextProvider';
import { UGC_USER } from '../utils/constants';

export default function PrivateRoutes({ allowedRoles }) {
    const { role, token, loading } = useAuth();
    
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to='/signIn' />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // If user is logged in but doesn't have the right role
        // Redirect to their respective dashboard
        if (role === UGC_USER) {
            return <Navigate to='/qaa/qaa' />;
        }
        return <Navigate to='/admin' />;
    }

    return <Outlet />;
}
