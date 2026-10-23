import { Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="relative z-10 pt-14 pb-10 border-t border-white/[0.08] bg-[#07080a]/90 backdrop-blur-xl text-slate-400">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
                    <div className="space-y-1.5 text-center md:text-left">
                        <h3 className="text-xl font-bold text-white tracking-tight">
                            Abdullah <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300">Anis</span>
                        </h3>
                        <p className="text-sm text-slate-400 max-w-sm">
                            Full Stack Web Developer crafting modern, high-performance web applications.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
                        <Link to="/" className="text-slate-400 hover:text-cyan-300 transition-colors">Home</Link>
                        <Link to="/about" className="text-slate-400 hover:text-cyan-300 transition-colors">About</Link>
                        <Link to="/skills" className="text-slate-400 hover:text-cyan-300 transition-colors">Skills</Link>
                        <Link to="/projects" className="text-slate-400 hover:text-cyan-300 transition-colors">Projects</Link>
                        <Link to="/contact" className="text-slate-400 hover:text-cyan-300 transition-colors">Contact</Link>
                    </div>

                    <div className="flex items-center gap-3 text-slate-400">
                        <a
                            href="https://github.com/AbdullahAnis1549"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Profile"
                            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-blue-600/15 hover:border-blue-500/40 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,102,255,0.35)] transition-all duration-300 border border-white/[0.08]"
                        >
                            <Github size={18} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/abdullah-anis-549648368?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn Profile"
                            className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-blue-600/15 hover:border-blue-500/40 hover:text-cyan-300 hover:shadow-[0_0_15px_rgba(0,102,255,0.35)] transition-all duration-300 border border-white/[0.08]"
                        >
                            <Linkedin size={18} />
                        </a>
                    </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 text-center sm:text-left">
                    <p>
                        &copy; {new Date().getFullYear()} <span className="text-slate-300 font-medium">Abdullah Anis</span>. All rights reserved.
                    </p>
                    <p className="text-slate-500 flex items-center gap-1.5 justify-center sm:justify-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                        Designed & Developed with Passion
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
