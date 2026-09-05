import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const Home = () => {
    const [content, setContent] = useState(null);

    useEffect(() => {
        const fetchHome = async () => {
            try {
                const { data } = await api.get('/content/home');
                setContent(data);
            } catch (error) {
                console.error('Error fetching home content:', error);
            }
        };
        fetchHome();
    }, []);

    // Data aane tak, blank ki jagah ek theme-matching spinner —
    // same container size use kiya hai taake content aane par layout "jump" na ho
    if (!content) {
        return (
            <div className="container mx-auto px-6 min-h-[calc(100vh-6rem)] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-gray-700 border-t-sky-400 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 min-h-[calc(100vh-6rem)] flex flex-col md:flex-row items-center justify-center gap-12">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="flex-1 space-y-8"
            >
                <div className="space-y-4">
                    <h2 className="text-sky-400 font-medium tracking-widest uppercase text-sm">Hello, I'm Abdullah Anis</h2>
                    <h1 className="text-3xl md:text-5xl font-bold leading-tight min-h-[4rem]">
                        <Typewriter text={content.heroTitle || "Welcome to my Portfolio"} />
                    </h1>
                    <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                        {content.heroSubtitle}
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    <Link to="/projects" className="btn-primary flex items-center gap-2 group">
                        {content.ctaButtons.projects}
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link to="/contact" className="btn-secondary">
                        {content.ctaButtons.contact}
                    </Link>
                </div>

                <div className="flex items-center gap-6 pt-8 text-gray-400">
                    <a href="https://github.com/AbdullahAnis1549" aria-label="GitHub Profile" className="hover:text-white transition-colors"><Github size={24} /></a>
                    <a href="https://www.linkedin.com/in/abdullah-anis-549648368?utm_source=share_via&utm_content=profile&utm_medium=member_android" aria-label="LinkedIn Profile" className="hover:text-white transition-colors"><Linkedin size={24} /></a>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="flex-1 relative"
            >
                <div className="w-full max-w-md mx-auto aspect-square rounded-full relative">
                    {/* Animated Background Orbs */}
                    <div className="absolute inset-0 bg-sky-500/20 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full" />

                    <img
                        src={content.heroImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80'}
                        alt="Profile"
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-cover rounded-[3rem] relative z-10 glass-card p-0"
                    />
                </div>
            </motion.div>
        </div>
    );
};

const Typewriter = ({ text }) => {
    const letters = Array.from(text);
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.04 * i },
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
            style={{ display: "flex", overflow: "hidden" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap"
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index} className={letter === ' ' ? 'mr-3' : ''}>
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
};

export default Home;
