import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllaboutUs } from '../Screens/cmsScreen/cms-components/cms-aboutUs/aboutsAPI';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [activeAboutusId, setActiveAboutusId] = useState(0)
    useEffect(() => {
        const fetchData = async () => {
            const data = await  getAllaboutUs()
            const active = data.filter(item => item.status === true )
            const activeId = active[0].id
            setActiveAboutusId(activeId)
        };
        fetchData()
    }, [])



    const [authState, setAuthState] = useState({
        email: null,
        userName: null,
        role: null,
        token: null,
    });
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const email = localStorage.getItem('email');
        const role = localStorage.getItem('role');
        const userName = localStorage.getItem('userName');

        if (token && email && role && userName) {
            setAuthState({ token, email, role, userName }); // Restore authState from localStorage
        }

        setLoading(false); // Set loading to false after the state is restored
    }, []);

    const login = ({ email, role, token, userName }) => {
        setAuthState({ email, role, token, userName });
        localStorage.setItem('authToken', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        localStorage.setItem('userName', userName);
    };

    const logout = () => {
        setAuthState({
            email: null,
            userName: null,
            role: null,
            token: null,
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
    };

    const value = {
        activeAboutusId,
        email: authState.email,
        role: authState.role,
        token: authState.token,
        userName: authState.userName,
        login,
        logout,
        loading,
         // Pass the loading state
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
