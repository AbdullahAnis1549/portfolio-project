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
        <div className="min-h-screen bg-[#020617] relative overflow-hidden pb-20">
            {/* Background Bloom Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-600/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 blur-[120px] rounded-full"></div>

            <div className="container mx-auto px-6 pt-32 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-5xl mx-auto"
                >
                    {/* Main Profile Card */}
                    <motion.div variants={itemVariants} className="glass-card overflow-hidden !p-0 border-white/5 shadow-2xl">
                        {/* Premium Cover Header */}
                        <div className="h-64 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-sky-600 via-cyan-700 to-blue-600">
                                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent"></div>

                            {/* Decorative Badge */}
                            <div className="absolute top-6 right-6 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                                <ShieldCheck size={16} className="text-green-400" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Verified Identity</span>
                            </div>
                        </div>

                        {/* Profile Header Content */}
                        <div className="px-6 sm:px-10 pb-6 sm:pb-10 relative">
                            <div className="flex flex-col md:flex-row items-center md:items-end gap-8 -mt-20 relative z-10">
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-cyan-600 rounded-[2.5rem] blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                                    <img
                                        src={home?.heroImage || "https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff&size=200"}
                                        alt="Profile"
                                        className="w-40 h-40 rounded-[2.2rem] border-4 border-[#020617] object-cover shadow-2xl relative"
                                    />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.5, type: 'spring' }}
                                        className="absolute bottom-3 right-3 w-8 h-8 bg-green-500 border-4 border-[#020617] rounded-full shadow-lg"
                                    ></motion.div>
                                </div>

                                <div className="flex-1 mb-4 text-center md:text-left">
                                    <motion.h1
                                        className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
                                    >
                                        {home?.heroTitle || 'Administrator'}
                                    </motion.h1>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                                        <p className="text-sky-400 font-semibold text-lg">{home?.heroSubtitle || 'Portfolio Owner'}</p>
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/20 hidden md:block"></span>
                                        <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                                            <MapPin size={14} />
                                            <span>{about?.personalInfo?.location || contact?.location || 'Karachi, Pakistan'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mb-4">
                                    <Link
                                        to="/contact"
                                        className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-sky-600/20 active:scale-95 flex items-center gap-2"
                                    >
                                        <Mail size={18} />
                                        Contact
                                    </Link>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid lg:grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/5">
                                {/* Left Column: Personal Data */}
                                <div className="lg:col-span-2 space-y-10">
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-sky-500/30 transition-colors group">
                                            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Calendar className="text-sky-400" size={24} />
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Availability</p>
                                            <p className="text-white font-medium text-lg">{about?.personalInfo?.availability || 'Available for Projects'}</p>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-colors group">
                                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Briefcase className="text-cyan-400" size={24} />
                                            </div>
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Experience</p>
                                            <p className="text-white font-medium text-lg">Full-Stack Development</p>
                                        </div>
                                    </div>

                                    {/* Detailed Status Section */}
                                    <div className="space-y-6">
                                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                            <Zap className="text-yellow-500" size={24} />
                                            Professional Profile
                                        </h2>
                                        <div className="prose prose-invert max-w-none">
                                            <div className="p-8 rounded-3xl bg-gradient-to-br from-sky-500/5 to-cyan-500/5 border border-white/5">
                                                <p className="text-gray-300 leading-relaxed text-lg italic">
                                                    "{about?.personalInfo?.title || 'Driven by the passion to build scalable and innovative web solutions that leave a lasting impact.'}"
                                                </p>
                                            </div>
                                        </div>

                                        {about?.fullBio && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold text-sky-400">Background & Philosophy</h3>
                                                <div className="text-gray-400 leading-relaxed space-y-4">
                                                    {about.fullBio.split('\n').map((para, i) => (
                                                        <p key={i}>{para}</p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Sidebar Stats & Contacts */}
                                <div className="space-y-8">
                                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                                        <h3 className="text-lg font-bold text-white mb-4">Contact Details</h3>
                                        <div className="space-y-4">
                                            <a href={`mailto:${contact?.email || 'admin@portfolio.com'}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                                    <Mail size={18} className="text-gray-400 group-hover:text-white" />
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="text-[10px] text-gray-500 uppercase font-bold">Primary Email</p>
                                                    <p className="text-sm text-gray-300 truncate">{contact?.email || 'admin@portfolio.com'}</p>
                                                </div>
                                            </a>
                                            {contact?.phone && (
                                                <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors group">
                                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                                        <Phone size={18} className="text-gray-400 group-hover:text-white" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] text-gray-500 uppercase font-bold">Contact Number</p>
                                                        <p className="text-sm text-gray-300">{contact.phone}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Verification Status */}
                                    <div className="p-8 rounded-3xl bg-sky-600/10 border border-sky-500/20 relative overflow-hidden group">
                                        <Zap className="absolute -right-4 -bottom-4 w-24 h-24 text-sky-500/10 group-hover:rotate-12 transition-transform" />
                                        <div className="flex items-center gap-3 mb-3">
                                            <Award size={20} className="text-sky-400" />
                                            <h4 className="font-bold text-white">System Admin</h4>
                                        </div>
                                        <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                                            All administrative privileges granted. This account is authorized to manage portfolio content, projects, and site configurations.
                                        </p>
                                    </div>

                                    {/* Quick Link/Call to action */}
                                    <button className="w-full py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold transition-all flex items-center justify-center gap-2 group">
                                        Download Resume
                                        <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Footer Quote */}
                    <motion.div variants={itemVariants} className="mt-12 text-center">
                        <p className="text-gray-500 text-sm italic">
                            &copy; {new Date().getFullYear()} Digital Portfolio. All rights reserved.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
