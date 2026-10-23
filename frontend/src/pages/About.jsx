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

    return (
        <div className="container mx-auto px-6 pb-24">
            {/* Bio Section */}
            <section className="min-h-[85vh] flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 pt-6">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 max-w-2xl space-y-6"
                >
                    <div className="space-y-2">
                        <div className="badge-electric">
                            <span>Discovery</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                            <Typewriter text="Professional Narrative" />
                        </h1>
                        <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full mt-3"></div>
                    </div>

                    <p className="max-w-[680px] text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {content?.fullBio}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.08]">
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Location</p>
                            <p className="text-white font-medium text-base mt-0.5">{content?.personalInfo?.location || 'Remote / Worldwide'}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                            <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold">Availability</p>
                            <p className="text-cyan-400 font-medium text-base mt-0.5">{content?.personalInfo?.availability || 'Available for Projects'}</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="flex-1 relative max-w-sm md:max-w-md flex justify-center"
                >
                    <div className="w-full aspect-square relative">
                        {/* Animated Electric Glow Orbs */}
                        <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full animate-pulse-slow" />
                        <div className="absolute -top-6 -right-6 w-36 h-36 bg-cyan-400/20 blur-[70px] rounded-full" />

                        <div className="relative z-10 w-full h-full rounded-[2.5rem] p-2 bg-gradient-to-b from-white/10 via-white/5 to-transparent border border-white/10 shadow-2xl shadow-black/80">
                            <img
                                src={homeContent?.heroImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80'}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-[2rem]"
                            />
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Services Section */}
            <section className="space-y-12 pt-28">
                <div className="text-center space-y-3">
                    <div className="badge-electric">
                        <span>Capabilities</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">What I Offer</h2>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
                        Specialized digital solutions engineered with high performance, scalability, and modern UX standards.
                    </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={service._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card group flex flex-col justify-between"
                        >
                            <div>
                                {isServiceIconImage(service.icon) ? (
                                    <div className="w-full h-44 sm:h-48 rounded-xl mb-6 bg-blue-500/10 border border-white/10 flex items-center justify-center p-4">
                                        <img
                                            src={getServiceIconSrc(service.icon)}
                                            alt={service.title}
                                            className="max-w-full max-h-full w-auto h-auto object-contain"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600/20 to-cyan-400/20 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 text-cyan-300 shadow-[0_0_20px_rgba(0,102,255,0.2)] group-hover:border-cyan-400 transition-colors">
                                        <span className="text-2xl">{service.icon || '🚀'}</span>
                                    </div>
                                )}
                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">{service.title}</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{service.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Education Section */}
            <section className="space-y-12 pt-28">
                <div className="text-center space-y-3">
                    <div className="badge-electric">
                        <span>Background</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Education &amp; Credentials</h2>
                </div>
                <div className="max-w-4xl mx-auto space-y-8 relative before:absolute before:inset-0 before:left-4 sm:before:left-8 before:w-0.5 before:bg-gradient-to-b before:from-blue-600 before:via-cyan-500/40 before:to-transparent">
                    {education.map((edu, index) => (
                        <motion.div
                            key={edu._id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative pl-10 sm:pl-20"
                        >
                            <div className="absolute left-2.5 sm:left-6.5 top-2 w-3.5 h-3.5 rounded-full bg-cyan-400 border-4 border-[#07080a] shadow-[0_0_10px_#00d2ff]" />
                            <div className="glass-card">
                                <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">{edu.period}</span>
                                <h3 className="text-xl font-bold text-white mt-1">{edu.degree} in {edu.field}</h3>
                                <h4 className="text-slate-300 font-medium text-sm mt-0.5">{edu.institution}</h4>
                                <p className="text-slate-400 text-sm mt-4 leading-relaxed">{edu.description}</p>
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
