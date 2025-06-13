import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContextProvider';

export default function PrivateRoutes() {
    const { role, token, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    return token ? <Outlet /> : <Navigate to='/signIn' />;
}
