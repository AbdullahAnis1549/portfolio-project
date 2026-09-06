import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { fetchAndCache } from '../hooks/useApiData';

const AppContext = createContext();

// Critical routes that MUST be loaded before any page renders
const CRITICAL_ROUTES = [
    '/content/home',
    '/content/about',
    '/education',
    '/services',
    '/skills',
    '/projects',
    '/contact/info',
];

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [siteSettings, setSiteSettings] = useState(null);
    // true = still waiting for critical data, false = ready to render pages
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
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

        const prefetchCriticalData = async () => {
            // Wait for ALL critical routes to resolve before revealing the app.
            // This prevents the 1-second blank/partial flash on Vercel where the
            // backend cold-start means data isn't ready when the page first renders.
            await Promise.allSettled(
                CRITICAL_ROUTES.map((route) =>
                    fetchAndCache(route, () => api.get(route))
                )
            );
            setAppReady(true);
        };

        loadUser();
        fetchSettings();
        prefetchCriticalData();
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
            {appReady ? children : <AppLoader />}
        </AppContext.Provider>
    );
};

// Minimal full-screen loader shown while critical data is being fetched
const AppLoader = () => (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f172a] gap-6">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/30 animate-pulse overflow-hidden">
            <img
                src="/logo.png"
                alt="AA Logo"
                className="w-full h-full object-cover"
            />
        </div>

        {/* Spinner */}
        <div className="flex gap-2">
            <span
                className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"
                style={{ animationDelay: '0ms' }}
            />
            <span
                className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"
                style={{ animationDelay: '150ms' }}
            />
            <span
                className="w-2 h-2 rounded-full bg-sky-400 animate-bounce"
                style={{ animationDelay: '300ms' }}
            />
        </div>
    </div>
);
export const useApp = () => useContext(AppContext);
