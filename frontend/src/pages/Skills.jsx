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
        <div className="container mx-auto px-6 pt-10 pb-20 space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">
                    <Typewriter text="Technical Skills" />
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                    Over the years, I've developed a diverse set of technical skills across different domains of software development.
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full transition-all capitalize ${activeCategory === cat ? 'bg-sky-600 text-white' : 'glass text-gray-400 hover:text-white'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSkills.map((skill, index) => (
                    <motion.div
                        key={skill._id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card flex flex-col gap-4"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-lg">{skill.name}</span>
                            <span className="text-sky-400 font-medium">{skill.proficiency}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${skill.proficiency}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-sky-600 to-cyan-500"
                            />
                        </div>
                    </motion.div>
                ))}
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

export default Skills;
