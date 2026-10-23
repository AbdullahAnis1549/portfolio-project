import { motion } from 'framer-motion';
import { User, MapPin, Mail, Calendar, Briefcase, Award, Phone, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useApiData } from '../hooks/useApiData';

const Profile = () => {
    // Same cache keys used by Home/About/Contact - if the visitor already
    // viewed those pages this navigates here with zero network requests.
    const { data: home } = useApiData('/content/home', () => api.get('/content/home'));
    const { data: about } = useApiData('/content/about', () => api.get('/content/about'));
    const { data: contact } = useApiData('/contact/info', () => api.get('/contact/info'));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#07080a] relative overflow-hidden pb-20">
            {/* Background Bloom Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none"></div>

            <div className="container mx-auto px-6 pt-28 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto"
                >
                    {/* Main Profile Card */}
                    <motion.div variants={itemVariants} className="glass-card overflow-hidden !p-0 border border-white/[0.08] shadow-2xl">
                        {/* Premium Cover Header */}
                        <div className="h-60 sm:h-64 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600">
                                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-[#0c0e14]/40 to-transparent"></div>

                            {/* Decorative Badge */}
                            <div className="absolute top-6 right-6 px-4 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2 shadow-lg">
                                <ShieldCheck size={16} className="text-emerald-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Verified Identity</span>
                            </div>
                        </div>

                        {/* Profile Header Content */}
                        <div className="px-6 sm:px-10 pb-8 sm:pb-10 relative">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 sm:gap-8 -mt-20 relative z-10">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-[2.2rem] blur opacity-60 group-hover:opacity-100 transition duration-500"></div>
                                    <img
                                        src={home?.heroImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80"}
                                        alt="Profile"
                                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-[2rem] border-4 border-[#0c0e14] object-cover shadow-2xl relative"
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: 'spring' }}
                                        className="absolute bottom-2.5 right-2.5 w-7 h-7 bg-emerald-400 border-4 border-[#0c0e14] rounded-full shadow-[0_0_10px_rgba(52,211,153,0.8)]"
                                    ></motion.div>
                                </div>

                                <div className="flex-1 mb-2 text-center md:text-left">
                                    <motion.h1
                                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight"
                                    >
                                        {home?.heroTitle || 'Abdullah Anis'}
                                    </motion.h1>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2.5">
                                        <p className="text-cyan-400 font-semibold text-base sm:text-lg">{home?.heroSubtitle || 'Full Stack Web Developer'}</p>
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 hidden md:block"></span>
                                        <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                                            <MapPin size={14} className="text-blue-400" />
                                            <span>{about?.personalInfo?.location || contact?.location || 'Remote / Worldwide'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mb-2">
                                    <Link
                                        to="/contact"
                                        className="btn-primary flex items-center gap-2 !px-5 !py-2.5 text-sm font-semibold"
                                    >
                                        <Mail size={16} />
                                        <span>Contact</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid lg:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/[0.08]">
                                {/* Left Column: Personal Data */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/30 transition-colors group">
                                            <div className="w-11 h-11 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-cyan-300">
                                                <Calendar size={22} />
                                            </div>
                                            <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Availability</p>
                                            <p className="text-white font-medium text-base">{about?.personalInfo?.availability || 'Available for Projects'}</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:border-cyan-500/30 transition-colors group">
                                            <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-cyan-300">
                                                <Briefcase size={22} />
                                            </div>
                                            <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider mb-0.5">Specialization</p>
                                            <p className="text-white font-medium text-base">Full-Stack Development</p>
                                        </div>
                                    </div>

                                    {/* Detailed Status Section */}
                                    <div className="space-y-5">
                                        <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
                                            <Zap className="text-cyan-400" size={20} />
                                            Professional Profile
                                        </h2>
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/5 border border-white/[0.08]">
                                            <p className="text-slate-300 leading-relaxed text-base italic">
                                                "{about?.personalInfo?.title || 'Driven by the passion to build scalable, secure, and intuitive web applications with world-class engineering standards.'}"
                                            </p>
                                        </div>

                                        {about?.fullBio && (
                                            <div className="space-y-3">
                                                <h3 className="text-base font-bold text-cyan-400">Background &amp; Philosophy</h3>
                                                <div className="text-slate-400 leading-relaxed space-y-3 text-sm sm:text-base">
                                                    {about.fullBio.split('\n').map((para, i) => (
                                                        <p key={i}>{para}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Sidebar Stats & Contacts */}
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.08] space-y-5">
                                        <h3 className="text-base font-bold text-white">Contact Details</h3>
                                        <div className="space-y-3">
                                            <a href={`mailto:${contact?.email || 'contact@example.com'}`} className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/[0.05] transition-colors group border border-transparent hover:border-white/5">
                                                <div className="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center shrink-0 text-cyan-300">
                                                    <Mail size={17} />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Primary Email</p>
                                                    <p className="text-xs sm:text-sm text-slate-300 truncate group-hover:text-white transition-colors">{contact?.email || 'contact@example.com'}</p>
                                                </div>
                                            </a>
                                            {contact?.phone && (
                                                <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/[0.05] transition-colors group border border-transparent hover:border-white/5">
                                                    <div className="w-10 h-10 rounded-lg bg-blue-600/15 border border-blue-500/20 flex items-center justify-center shrink-0 text-cyan-300">
                                                        <Phone size={17} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Contact Number</p>
                                                        <p className="text-xs sm:text-sm text-slate-300">{contact.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Verification Status */}
                                    <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/25 relative overflow-hidden group">
                                        <Zap className="absolute -right-3 -bottom-3 w-20 h-20 text-blue-500/10 group-hover:rotate-12 transition-transform" />
                                        <div className="flex items-center gap-2.5 mb-2.5">
                                            <Award size={18} className="text-cyan-400" />
                                            <h4 className="font-bold text-white text-sm">System Verified</h4>
                                        </div>
                                        <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                                            Verified administrative account authorized to manage portfolio projects, content, and system configurations.
                                        </p>
                                    </div>

                                    {/* Quick Link/Call to action */}
                                    <Link 
                                        to="/contact"
                                        className="w-full btn-secondary text-sm flex items-center justify-center gap-2"
                                    >
                                        <span>Initiate Collaboration</span>
                                        <ExternalLink size={15} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer Quote */}
                    <motion.div variants={itemVariants} className="mt-10 text-center">
                        <p className="text-slate-500 text-xs italic">
                            &copy; {new Date().getFullYear()} Digital Portfolio. All rights reserved.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
