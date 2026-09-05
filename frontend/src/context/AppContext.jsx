import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [siteSettings, setSiteSettings] = useState(null);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                // Here you would typically verify the token with the backend
                // For now we'll just set a dummy user if token exists
                setUser({ token });
            }
            setLoading(false);
        };

        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/settings');
                setSiteSettings(data);
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };

        loadUser();
        fetchSettings();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AppContext.Provider value={{ user, loading, siteSettings, login, logout }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
