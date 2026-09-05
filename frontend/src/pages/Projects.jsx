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
        <div className="container mx-auto px-6 pt-10 pb-20 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">
                    <Typewriter text="Featured Projects" />
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                    A showcase of my recent work, side projects, and open source contributions.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex flex-wrap gap-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-lg text-sm transition-all ${activeCategory === cat ? 'bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'glass text-gray-400 hover:text-white'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search projects or tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full glass bg-white/5 rounded-xl py-3 pl-12 pr-6 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode='popLayout'>
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            layout
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            className="glass-card group flex flex-col h-full overflow-hidden p-0 rounded-2xl"
                        >
                            <div className="relative overflow-hidden aspect-video">
                                <img
                                    src={project.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80'}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-60" />
                                {project.featured && (
                                    <span className="absolute top-4 right-4 bg-sky-500 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className="p-6 flex flex-col flex-grow space-y-4">
                                <h3 className="text-xl font-bold group-hover:text-sky-400 transition-colors">{project.title}</h3>
                                <p className="text-gray-400 text-sm line-clamp-3">{project.description}</p>

                                <div className="flex flex-wrap gap-2 pt-2">
                                    {project.technologies.map(tech => (
                                        <span key={tech} className="text-[10px] py-1 px-2 rounded-md bg-white/5 border border-white/10 text-gray-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center gap-4 pt-4 mt-auto">
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 glass rounded-lg hover:text-sky-400 transition-colors"
                                    >
                                        <Github size={20} />
                                    </a>
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 glass rounded-lg hover:text-sky-400 transition-colors"
                                    >
                                        <ExternalLink size={20} />
                                    </a>
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
