import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useApiData } from '../hooks/useApiData';

const Home = () => {
    const { data: content } = useApiData('/content/home', () => api.get('/content/home'));

    return (
        <div className="container mx-auto px-6 min-h-[calc(100vh-6rem)] flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-16 py-8">
            <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 space-y-8"
            >
                <div className="space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="badge-electric"
                    >
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00d2ff]" />
                        <span>Available for Projects</span>
                    </motion.div>

                    <h2 className="text-cyan-400 font-semibold tracking-widest uppercase text-xs sm:text-sm">
                        Hello, I'm Abdullah Anis
                    </h2>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight text-white min-h-[4rem]">
                        <Typewriter text={content?.heroTitle || "Welcome to my Portfolio"} />
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
                        {content?.heroSubtitle}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <Link to="/projects" className="btn-primary flex items-center gap-2 group">
                        <span>{content?.ctaButtons?.projects || "Explore Projects"}</span>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link to="/contact" className="btn-secondary">
                        {content?.ctaButtons?.contact || "Get In Touch"}
                    </Link>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center gap-6 text-slate-400 border-t border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <a 
                            href="https://github.com/AbdullahAnis1549" 
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub Profile" 
                            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(0,102,255,0.35)] transition-all duration-300"
                        >
                            <Github size={20} />
                        </a>
                        <a 
                            href="https://www.linkedin.com/in/abdullah-anis-549648368?utm_source=share_via&utm_content=profile&utm_medium=member_android" 
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn Profile" 
                            className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(0,102,255,0.35)] transition-all duration-300"
                        >
                            <Linkedin size={20} />
                        </a>
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                        Focused on <span className="text-white font-semibold">Full Stack Systems</span> &amp; Modern UI
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex-1 relative flex justify-center"
            >
                <div className="w-full max-w-md aspect-square relative">
                    {/* Electric Ambient Glow Behind Avatar */}
                    <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full animate-pulse-slow" />
                    <div className="absolute -top-6 -right-6 w-48 h-48 bg-cyan-400/20 blur-[70px] rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-blue-700/25 blur-[80px] rounded-full" />

                    <div className="relative z-10 w-full h-full rounded-[2.5rem] p-2 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/10 shadow-2xl shadow-black/80 group">
                        <img
                            src={content?.heroImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80'}
                            alt="Profile"
                            fetchPriority="high"
                            decoding="async"
                            className="w-full h-full object-cover rounded-[2rem] transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const Typewriter = ({ text }) => {
    const words = text ? text.split(' ') : [];
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: 0.03 * i },
        }),
    };

    const child = {
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
        hidden: {
            opacity: 0,
            x: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 200,
            },
        },
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap"
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-2.5 sm:mr-3.5">
                    {Array.from(word).map((letter, letterIndex) => (
                        <motion.span variants={child} key={letterIndex} className="inline-block">
                            {letter}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.div>
    );
};

export default Home;
