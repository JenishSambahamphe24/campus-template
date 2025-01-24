import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContextProvider';

export default function PrivateRoutes() {
    const { role, token, loading } = useAuth(); // Destructure loading

    if (loading) {
        // While loading auth state, you can show a loading indicator
        return <div>Loading...</div>; // You can customize this
    }

    return token ? <Outlet /> : <Navigate to='/signIn' />;
}
