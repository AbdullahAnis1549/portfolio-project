import { motion } from 'framer-motion';
import api from '../services/api';
import { useApiData } from '../hooks/useApiData';

const About = () => {
    // Each of these is cached by key, so if the visitor already loaded Home
    // (which fetches '/content/home') or another page that needed the same
    // data, it's served instantly here with no extra network request.
    const { data: content } = useApiData('/content/about', () => api.get('/content/about'));
    const { data: homeContent } = useApiData('/content/home', () => api.get('/content/home'));
    const { data: educationData } = useApiData('/education', () => api.get('/education'));
    const { data: servicesData } = useApiData('/services', () => api.get('/services'));
    const education = educationData ?? [];
    const services = servicesData ?? [];

    if (!content) return null;

    return (
        <div className="container mx-auto px-6 pb-20">
            {/* Bio Section */}
            <section className="min-h-[90vh] flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20 pt-2">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 max-w-2xl space-y-4"
                >
                    <div>
                        <h2 className="text-sky-400 font-medium tracking-widest uppercase text-sm mb-2">Discovery</h2>
                        <h1 className="text-4xl md:text-5xl font-bold">
                            <Typewriter text="Professional Narrative" />
                        </h1>
                        <div className="w-20 h-1 bg-sky-400 rounded-full mt-4"></div>
                    </div>

                    <p className="
max-w-[680px]
text-gray-300
text-lg
leading-relaxed
whitespace-pre-wrap
">
                        {content.fullBio}
                    </p>

                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <p className="text-gray-500 text-sm uppercase tracking-wider">Location</p>
                            <p className="text-white font-medium">{content.personalInfo.location}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-gray-500 text-sm uppercase tracking-wider">Availability</p>
                            <p className="text-white font-medium">{content.personalInfo.availability}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 relative max-w-sm md:max-w-lg"
                >
                    <div className="w-full aspect-square relative">
                        {/* Animated Background Orbs inside About (matching Home) */}
                        <div className="absolute inset-0 bg-sky-500/20 blur-[100px] rounded-full animate-pulse" />

                        <img
                            src={homeContent?.heroImage || 'https://via.placeholder.com/600x600'}
                            alt="Profile"
                            className="w-full h-full object-cover rounded-[3rem] relative z-10 glass-card p-0"
                        />
                    </div>
                </motion.div>
            </section>

            {/* Services Section */}
            <section className="space-y-12 pt-32">
                <h2 className="text-3xl font-bold text-center">What I Offer</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card"
                        >
                            {isServiceIconImage(service.icon) ? (
                                <div className="w-full h-44 sm:h-48 rounded-xl mb-6 bg-sky-500/10 border border-white/10 flex items-center justify-center p-4">
                                    <img
                                        src={getServiceIconSrc(service.icon)}
                                        alt={service.title}
                                        className="max-w-full max-h-full w-auto h-auto object-contain"
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 bg-sky-500/20 rounded-xl flex items-center justify-center mb-6 text-sky-400">
                                    <span className="text-3xl">{service.icon || '🚀'}</span>
                                </div>
                            )}
                            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                            <p className="text-gray-400">{service.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section className="space-y-12 pt-32">
                <h2 className="text-3xl font-bold text-center">Education</h2>
                <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-8 before:w-0.5 before:bg-white/10">
                    {education.map((edu, index) => (
                        <motion.div
                            key={edu._id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-10 sm:pl-20"
                        >
                            <div className="absolute left-2 sm:left-6 top-0 w-4 h-4 rounded-full bg-sky-500 border-4 border-dark" />
                            <div className="glass-card">
                                <span className="text-sky-400 text-sm font-medium">{edu.period}</span>
                                <h3 className="text-xl font-bold mt-1">{edu.degree} in {edu.field}</h3>
                                <h4 className="text-gray-300 font-medium">{edu.institution}</h4>
                                <p className="text-gray-400 mt-4">{edu.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

const isServiceIconImage = (icon) =>
    !!icon && (icon.startsWith('http') || icon.startsWith('/uploads'));

const getServiceIconSrc = (icon) =>
    icon.startsWith('http') ? icon : `${BACKEND_URL}${icon}`;

const Typewriter = ({ text }) => {
    const words = text.split(' ');
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
            className="flex flex-wrap"
        >
            {words.map((word, wordIndex) => (
                <span key={wordIndex} className="inline-block whitespace-nowrap mr-3">
                    {Array.from(word).map((letter, letterIndex) => (
                        <motion.span variants={child} key={letterIndex}>
                            {letter}
                        </motion.span>
                    ))}
                </span>
            ))}
        </motion.div>
    );
};

export default About;
