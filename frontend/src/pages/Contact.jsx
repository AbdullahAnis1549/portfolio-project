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
        <div className="container mx-auto px-6 pt-10 pb-20">
            <div className="grid lg:grid-cols-2 gap-16">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-12"
                >
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold">
                            <Typewriter text="Get In Touch" />
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Have a project in mind? Or just want to say hi? Feel free to reach out.
                            I'm always open to new opportunities and collaborations.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-6 glass-card p-4">
                            <div className="w-12 h-12 bg-sky-500/10 rounded-full flex items-center justify-center text-sky-400">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Email</h4>
                                <p className="text-lg">{contactInfo?.email || 'test@example.com'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 glass-card p-4">
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Phone</h4>
                                <p className="text-lg">{contactInfo?.phone || '+1 234 567 890'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 glass-card p-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider">Location</h4>
                                <p className="text-lg">{contactInfo?.location || 'New York, NY'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card p-6 sm:p-8 lg:p-12 relative overflow-hidden"
                >
                    {status === 'success' && (
                        <div className="absolute inset-0 bg-dark/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                            <CheckCircle size={64} className="text-green-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                            <p className="text-gray-400">Thanks for reaching out. I'll get back to you soon.</p>
                            <button onClick={() => setStatus('idle')} className="mt-8 text-sky-400 font-medium hover:underline">Send another message</button>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Your Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                                    placeholder="example@gmail.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                                placeholder="How can I help you?"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Message</label>
                            <textarea
                                name="message"
                                required
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-sky-500/50 transition-all resize-none"
                                placeholder="Tell me more about your project..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg"
                        >
                            {status === 'loading' ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Send Message</span>
                                    <Send size={20} />
                                </>
                            )}
                        </button>

                        {status === 'error' && (
                            <p className="text-red-400 text-sm flex items-center gap-2 justify-center">
                                <AlertCircle size={16} /> Something went wrong. Please try again.
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
