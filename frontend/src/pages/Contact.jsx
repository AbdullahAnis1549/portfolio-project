import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import api from '../services/api';
import { useApiData } from '../hooks/useApiData';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const { data: contactInfo } = useApiData('/contact/info', () => api.get('/contact/info'));
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await api.post('/contact/send-message', formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Error sending message:', error);
            setStatus('error');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto px-6 pt-6 pb-24">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-10"
                >
                    <div className="space-y-3">
                        <div className="badge-electric">
                            <span>Reach Out</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            <Typewriter text="Get In Touch" />
                        </h2>
                        <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg">
                            Have an upcoming project, architecture question, or potential collaboration? 
                            I'm always eager to discuss new ideas and technical challenges.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-5 glass-card p-5 group border border-white/[0.08] hover:border-blue-500/40">
                            <div className="w-12 h-12 bg-blue-600/15 border border-blue-500/30 rounded-xl flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,102,255,0.2)] group-hover:scale-105 transition-transform">
                                <Mail size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Email Address</h4>
                                <p className="text-white font-medium text-base group-hover:text-cyan-300 transition-colors">{contactInfo?.email || 'contact@example.com'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 glass-card p-5 group border border-white/[0.08] hover:border-blue-500/40">
                            <div className="w-12 h-12 bg-blue-600/15 border border-blue-500/30 rounded-xl flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,102,255,0.2)] group-hover:scale-105 transition-transform">
                                <Phone size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Phone / WhatsApp</h4>
                                <p className="text-white font-medium text-base group-hover:text-cyan-300 transition-colors">{contactInfo?.phone || '+1 234 567 890'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 glass-card p-5 group border border-white/[0.08] hover:border-blue-500/40">
                            <div className="w-12 h-12 bg-blue-600/15 border border-blue-500/30 rounded-xl flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,102,255,0.2)] group-hover:scale-105 transition-transform">
                                <MapPin size={22} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider">Location</h4>
                                <p className="text-white font-medium text-base group-hover:text-cyan-300 transition-colors">{contactInfo?.location || 'Remote / Global'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 sm:p-8 lg:p-10 relative overflow-hidden border border-white/[0.08] shadow-2xl"
                >
                    {status === 'success' && (
                        <div className="absolute inset-0 bg-[#07080a]/95 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                                <CheckCircle size={36} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message Sent Successfully!</h3>
                            <p className="text-slate-400 text-sm max-w-sm">Thanks for reaching out. I'll review your inquiry and reply promptly.</p>
                            <button onClick={() => setStatus('idle')} className="mt-6 px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-cyan-300 text-sm font-semibold hover:bg-white/10 transition-colors">
                                Send another message
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 transition-all text-sm"
                                    placeholder="Abdullah"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 transition-all text-sm"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 transition-all text-sm"
                                placeholder="Project Discussion"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Message</label>
                            <textarea
                                name="message"
                                required
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 text-white placeholder-slate-500 transition-all text-sm resize-none"
                                placeholder="Tell me more about your requirements or idea..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 text-base font-semibold shadow-lg shadow-blue-600/30"
                        >
                            {status === 'loading' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Send Message</span>
                                    <Send size={18} />
                                </>
                            )}
                        </button>

                        {status === 'error' && (
                            <p className="text-red-400 text-xs sm:text-sm flex items-center gap-2 justify-center">
                                <AlertCircle size={15} /> Failed to send message. Please try again.
                            </p>
                        )}
                    </form>
                </motion.div>
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

export default Contact;
