import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('skillbridge-user');
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('skillbridge-token') || '');

    useEffect(() => {
        if (user) {
            localStorage.setItem('skillbridge-user', JSON.stringify(user));
        } else {
            localStorage.removeItem('skillbridge-user');
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem('skillbridge-token', token);
        } else {
            localStorage.removeItem('skillbridge-token');
        }
    }, [token]);

    const value = useMemo(() => ({
        user,
        token,
        setUser,
        setToken,
        logout: () => {
            setUser(null);
            setToken('');
        },
    }), [user, token]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
