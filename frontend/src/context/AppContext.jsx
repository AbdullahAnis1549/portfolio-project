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

// Full-screen loader shown while critical data is being fetched
const AppLoader = () => (
    <div
        role="status"
        aria-label="Loading portfolio"
        className="relative flex min-h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden bg-[#07080a] text-[#f8fafc]"
        style={{
            backgroundImage:
                'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), radial-gradient(ellipse at 15% 15%, rgba(0, 102, 255, 0.16), transparent 55%), radial-gradient(ellipse at 85% 85%, rgba(0, 210, 255, 0.12), transparent 55%)',
            backgroundSize: '32px 32px, 100% 100%, 100% 100%',
        }}
    >
        <div className="relative flex flex-col items-center gap-6">
            <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#0052cc] via-[#0066ff] to-[#00d2ff] shadow-[0_0_30px_rgba(0,102,255,0.35)] animate-pulse">
                <img
                    src="/logo.png"
                    alt="Abdullah Anis logo"
                    className="h-full w-full object-cover"
                />
            </div>

            <span className="text-sm font-medium tracking-wide text-slate-300">
                Loading portfolio
            </span>

            <div className="flex gap-2" aria-hidden="true">
                {[0, 150, 300].map((delay) => (
                    <span
                        key={delay}
                        className="h-2 w-2 rounded-full bg-[#38bdf8] shadow-[0_0_12px_rgba(0,210,255,0.6)] animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                    />
                ))}
            </div>
        </div>
    </div>
);
export const useApp = () => useContext(AppContext);
