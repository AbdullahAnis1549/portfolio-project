import { motion } from 'framer-motion';
import { useState } from 'react';
import api from '../services/api';
import { useApiData } from '../hooks/useApiData';

const Skills = () => {
    const { data: skillsData } = useApiData('/skills', () => api.get('/skills'));
    const skills = skillsData ?? [];
    const [activeCategory, setActiveCategory] = useState('All');

    const categories = ['All', ...new Set(skills.map(s => s.category))];

    const filteredSkills = activeCategory === 'All'
        ? skills
        : skills.filter(skill => skill.category === activeCategory);

    return (
        <div className="container mx-auto px-6 pt-6 pb-24 space-y-12">
            <div className="text-center space-y-3">
                <div className="badge-electric">
                    <span>Expertise</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    <Typewriter text="Technical Skills" />
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto text-base">
                    A comprehensive overview of tools, frameworks, and technologies I work with to architect robust web applications.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
                {categories.map(cat => {
                    const isActive = activeCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-5 py-2 rounded-full text-sm transition-all duration-300 capitalize ${
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => (
                    <motion.div
                        key={skill._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card group flex flex-col justify-between gap-4 p-6"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">{skill.name}</span>
                            <span className="text-cyan-400 font-mono font-bold text-sm bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full h-2.5 bg-white/[0.04] rounded-full overflow-hidden p-[2px] border border-white/[0.06]">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300 shadow-[0_0_12px_rgba(0,210,255,0.5)]"
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
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
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-wrap justify-center"
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

export default Skills;
