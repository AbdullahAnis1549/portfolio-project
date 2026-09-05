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
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass py-4 shadow-lg' : 'bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="relative flex-shrink-0" ref={dropdownRef}>
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 focus:outline-none group"
                    >
                        <div className="relative">
                            <img
                                src={`${BACKEND_URL}/uploads/logo.png`}
                                alt="Logo"
                                className="w-10 h-10 object-cover rounded-full border-2 border-sky-500/30 group-hover:border-sky-500 transition-all duration-300 shadow-lg shadow-sky-500/20"
                                onError={(e) => {
                                    e.target.src = "https://ui-avatars.com/api/?name=Portfolio&background=6366f1&color=fff";
                                }}
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isProfileOpen && (
                        <div className="absolute top-full left-0 mt-3 w-52 glass rounded-2xl shadow-2xl py-3 z-[60] border border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="px-4 py-2 border-b border-white/5 mb-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
                            </div>
                            <Link
                                to="/profile"
                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all mx-2 rounded-lg"
                                onClick={() => setIsProfileOpen(false)}
                            >
                                <div className="p-1.5 bg-sky-500/10 rounded-md">
                                    <User size={16} className="text-sky-400" />
                                </div>
                                <span>My Profile</span>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Desktop Links - Centered */}
                <div className="hidden md:flex items-center justify-center flex-grow">
                    <div className="flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`text-sm font-medium transition-colors hover:text-sky-400 ${location.pathname === link.path ? 'text-sky-500' : 'text-gray-300'}`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Empty div to balance the layout for desktop, or keeps space for mobile button */}
                <div className="flex-shrink-0 w-[100px] md:flex hidden"></div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass absolute top-full left-0 w-full p-6 space-y-4 animate-fade-in">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="block text-lg font-medium text-gray-300 hover:text-white"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-4 border-t border-white/5">
                        <Link
                            to="/profile"
                            className="block text-lg font-medium text-sky-400 hover:text-sky-300"
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
