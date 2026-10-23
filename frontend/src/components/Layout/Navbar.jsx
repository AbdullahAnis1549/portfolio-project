import { Menu, X, User, ChevronDown } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user, logout } = useApp();
    const dropdownRef = useRef(null);

    const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Skills', path: '/skills' },
        { name: 'Projects', path: '/projects' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-3.5 shadow-2xl shadow-black/80' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2.5 focus:outline-none group"
                        aria-label="Toggle user menu"
                    >
                        <div className="relative">
                            <img
                                src={`${BACKEND_URL}/uploads/logo.png`}
                                alt="Logo"
                                className="w-10 h-10 object-cover rounded-full border-2 border-blue-500/40 group-hover:border-cyan-400 transition-all duration-300 shadow-lg shadow-blue-500/20 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.4)]"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/logo.png";
                                }}
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#07080a] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                        </div>
                        <ChevronDown size={14} className={`text-slate-400 group-hover:text-white transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute top-full left-0 mt-3 w-56 glass rounded-2xl shadow-2xl p-2 z-[60] border border-white/10 animate-in fade-in slide-in-from-top-3 duration-200">
                            <div className="px-3 py-2 border-b border-white/5 mb-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Account Navigation</p>
                            </div>
                            <Link
                                to="/profile"
                                className="flex items-center space-x-3 px-3 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-blue-600/10 hover:border-blue-500/20 border border-transparent transition-all rounded-xl"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <div className="p-2 bg-blue-500/15 rounded-lg text-cyan-400">
                                    <User size={16} />
                                </div>
                                <span className="font-medium">My Profile</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Desktop Links - Floating Pill Design */}
                <div className="hidden md:flex items-center justify-center flex-grow">
                    <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-inner shadow-white/5">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                                        isActive
                                            ? 'text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-[0_0_15px_rgba(0,102,255,0.45)]'
                                            : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Action / CTA for Desktop */}
                <div className="hidden md:flex items-center justify-end flex-shrink-0">
                    <Link
                        to="/contact"
                        className="text-xs font-semibold px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-cyan-300 hover:bg-blue-600 hover:text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(0,102,255,0.5)] transition-all duration-300"
                    >
                        Let's Talk
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-colors" 
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass absolute top-full left-0 w-full p-6 space-y-2 border-b border-white/10 shadow-2xl animate-fade-in">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`block px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                                    isActive
                                        ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/30 font-semibold'
                                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                    <div className="pt-3 mt-2 border-t border-white/10">
                        <Link
                            to="/profile"
                            className="block px-4 py-2.5 rounded-xl text-base font-medium text-cyan-400 hover:text-cyan-300 hover:bg-blue-500/10 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            My Profile
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
