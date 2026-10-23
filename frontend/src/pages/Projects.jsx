import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Github, Search } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import { useApiData } from '../hooks/useApiData';

const Projects = () => {
    const { data: projectsData } = useApiData('/projects', () => api.get('/projects'));
    const projects = projectsData ?? [];
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', ...new Set(projects.map(p => p.category))];

    const filteredProjects = projects.filter(project => {
        const matchesCategory = activeCategory === 'All' || project.category === activeCategory;
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container mx-auto px-6 pt-6 pb-24 space-y-12">
            <div className="text-center space-y-3">
                <div className="badge-electric">
                    <span>Portfolio</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    <Typewriter text="Featured Projects" />
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-base">
                    A curated showcase of recent web applications, production systems, and creative experiments.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-wrap gap-2.5">
                    {categories.map(cat => {
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 capitalize ${
                                    isActive 
                                        ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-semibold shadow-[0_0_20px_rgba(0,102,255,0.4)] border border-white/20' 
                                        : 'glass text-slate-400 hover:text-white hover:border-blue-500/30'
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                    <input
                        type="text"
                        placeholder="Search projects or stack..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full glass bg-white/[0.03] rounded-xl py-2.5 pl-11 pr-4 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-slate-200 placeholder-slate-500 transition-all text-sm border border-white/[0.08]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project) => (
                        <motion.div
                            layout
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.35 }}
                            className="glass-card group flex flex-col h-full overflow-hidden !p-0 rounded-2xl border border-white/[0.08] hover:border-blue-500/40 hover:shadow-[0_0_30px_rgba(0,102,255,0.2)]"
                        >
                            <div className="relative overflow-hidden aspect-video bg-black/40">
                                <img
                                    src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-[#0c0e14]/40 to-transparent opacity-80" />
                                {project.featured && (
                                    <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(0,102,255,0.5)] border border-white/20">
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow space-y-4">
                                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">{project.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">{project.description}</p>

                                <div className="flex flex-wrap gap-1.5 pt-2">
                                    {project.technologies.map(tech => (
                                        <span key={tech} className="text-[11px] font-medium py-1 px-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 group-hover:border-blue-500/20 transition-colors">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3 pt-4 mt-auto border-t border-white/[0.06]">
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="GitHub Repository"
                                            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-cyan-300 hover:bg-blue-600/10 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(0,102,255,0.3)] transition-all flex items-center gap-1.5 text-xs font-semibold"
                                        >
                                            <Github size={16} />
                                            <span>Source</span>
                                        </a>
                                    )}
                                    {project.liveUrl && (
                                        <a
                                            href={project.liveUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label="Live Demo"
                                            className="p-2.5 rounded-xl bg-blue-600/15 border border-blue-500/30 text-cyan-300 hover:bg-blue-600 hover:text-white hover:border-blue-400 hover:shadow-[0_0_20px_rgba(0,102,255,0.4)] transition-all flex items-center gap-1.5 text-xs font-semibold ml-auto"
                                        >
                                            <span>Live Preview</span>
                                            <ExternalLink size={15} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
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
            style={{ display: "inline-flex", overflow: "hidden" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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

export default Projects;
