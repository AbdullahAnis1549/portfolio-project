import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/login';

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="bg-glow-wrapper"></div>
            {!isAdminRoute && <Navbar />}
            <main className={`flex-grow relative z-10 ${!isAdminRoute ? 'pt-24' : ''}`}>
                {children}
            </main>
            {!isAdminRoute && <Footer />}
        </div>
    );
};

export default Layout;
