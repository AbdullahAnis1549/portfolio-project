import { Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative z-10 pt-14 pb-10 border-t border-white/10 bg-[#0b1120]/80 backdrop-blur-md text-gray-400">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
                    <div className="space-y-1 text-center md:text-left">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            Abdullah <span className="text-sky-400">Anis</span>
                        </h3>
                        <p className="text-sm text-gray-400 max-w-sm">
                            Full Stack Web Developer crafting modern, high-performance web applications.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
                        <Link to="/" className="hover:text-sky-400 transition-colors">Home</Link>
                        <Link to="/about" className="hover:text-sky-400 transition-colors">About</Link>
                        <Link to="/skills" className="hover:text-sky-400 transition-colors">Skills</Link>
                        <Link to="/projects" className="hover:text-sky-400 transition-colors">Projects</Link>
                        <Link to="/contact" className="hover:text-sky-400 transition-colors">Contact</Link>
                    </div>

                    <div className="flex items-center gap-3 text-gray-400">
                        <a
                            href="https://github.com/AbdullahAnis1549"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Profile"
                            className="p-2.5 rounded-full bg-white/5 hover:bg-sky-500/10 hover:text-sky-400 transition-all duration-300 border border-white/5"
                        >
                            <Github size={18} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/abdullah-anis-549648368?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn Profile"
                            className="p-2.5 rounded-full bg-white/5 hover:bg-sky-500/10 hover:text-sky-400 transition-all duration-300 border border-white/5"
                        >
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-3 text-center sm:text-left">
                    <p>
                        &copy; {new Date().getFullYear()} <span className="text-gray-300 font-medium">Abdullah Anis</span>. All rights reserved.
                    </p>
                    <p className="text-gray-500">
                        Designed & Developed with Passion
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
