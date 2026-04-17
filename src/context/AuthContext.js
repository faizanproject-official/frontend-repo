import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || sessionStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Verify token / fetch user details on load
            api.get('/user')
                .then(res => {
                    setUser(res.data);
                    // Ensure consistency: if admin, make sure it's in session storage
                    if (res.data.is_admin) {
                        if (!sessionStorage.getItem('token')) {
                            // This handles valid token but wrong storage (e.g. if code changed)
                            // or just verifying session.
                            // For strict enforcement, we might want to migrate it or just leave it.
                            // But let's respect the login flow.
                        }
                    }
                })
                .catch((err) => {
                    // Only logout if explicitly unauthorized. 
                    // Network errors or 500s shouldn't kill the session, 
                    // though they might break the UI temporarily.
                    if (err.response && err.response.status === 401) {
                        logout();
                    } else {
                        console.error("Auth check failed but session preserved:", err);
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/login', { email, password });
        const { token, user } = response.data;

        if (user.is_admin) {
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('isAdmin', 'true');
            // Ensure local storage is clean for admin to prevent persistence
            localStorage.removeItem('token');
            localStorage.removeItem('isAdmin');
        } else {
            localStorage.setItem('token', token);
            localStorage.setItem('isAdmin', 'false');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('isAdmin');
        }

        setToken(token);
        setUser(user);
        return user;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAdmin');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isAdmin');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.is_admin,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
