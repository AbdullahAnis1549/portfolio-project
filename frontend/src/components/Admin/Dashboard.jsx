import {
    BookOpen,
    Briefcase,
    ChevronRight,
    Code,
    Cpu,
    Edit2,
    Home,
    LogOut,
    MessageSquare,
    Phone,
    Plus,
    Save,
    Trash2,
    User,
    X,
    Menu
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import api from '../../services/api';
import { invalidateApiCache } from '../../hooks/useApiData';

const AdminDashboard = () => {
    const { user, logout } = useApp();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('home');
    const [data, setData] = useState({
        home: { heroTitle: '', heroSubtitle: '', heroImage: '', ctaButtons: { projects: '', contact: '' } },
        about: { bio: '', fullBio: '', personalInfo: { location: '', availability: '' } },
        skills: [],
        projects: [],
        messages: [],
        education: [],
        services: [],
        contactInfo: { email: '', phone: '', location: '', socialLinks: [] }
    });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [editItem, setEditItem] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchAllData();
        }
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [home, about, skills, projects, msgs, edu, svc, contact] = await Promise.all([
                api.get('/content/home'),
                api.get('/content/about'),
                api.get('/skills'),
                api.get('/projects'),
                api.get('/contact/messages'),
                api.get('/education'),
                api.get('/services'),
                api.get('/contact/info')
            ]);
            setData({
                home: home.data,
                about: about.data,
                skills: skills.data,
                projects: projects.data,
                messages: msgs.data,
                education: edu.data,
                services: svc.data,
                contactInfo: contact.data
            });
        } catch (err) {
            console.error('Error fetching admin data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (endpoint, payload) => {
        try {
            await api.put(endpoint, payload);
            invalidateApiCache(); // public pages shouldn't show stale data after an admin edit
            setMessage('Updated successfully!');
            setTimeout(() => setMessage(''), 3000);
            fetchAllData();
        } catch (err) {
            alert('Update failed: ' + err.message);
        }
    };

    const handleDelete = async (endpoint, id) => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`${endpoint}/${id}`);
                invalidateApiCache();
                fetchAllData();
            } catch (err) {
                alert('Delete failed');
            }
        }
    };

    const handleAddItem = async (endpoint, payload) => {
        try {
            if (payload._id) {
                // Update existing item
                await api.put(`${endpoint}/${payload._id}`, payload);
                setMessage('Updated successfully!');
            } else {
                // Create new item
                await api.post(endpoint, payload);
                setMessage('Added successfully!');
            }
            invalidateApiCache();
            setEditItem(null);
            setTimeout(() => setMessage(''), 3000);
            fetchAllData();
        } catch (err) {
            alert('Operation failed: ' + err.message);
        }
    };

    const handleImageUpload = async (e, type, id = null) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        try {
            setMessage('Uploading image...');
            const { data: uploadRes } = await api.post('/media/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
            const imageUrl = uploadRes.url.startsWith('http') ? uploadRes.url : `${backendUrl}${uploadRes.url}`;

            if (type === 'home') {
                setData(prev => ({ ...prev, home: { ...prev.home, heroImage: imageUrl } }));
            } else if (type === 'project') {
                setEditItem(prev => ({ ...prev, image: imageUrl }));
            } else if (type === 'service') {
                setEditItem(prev => ({ ...prev, icon: imageUrl }));
            }

            setMessage('Image uploaded! Don\'t forget to save/create.');
        } catch (err) {
            alert('Upload failed: ' + err.message);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading Dashboard...</div>;

    const sidebarItems = [
        { id: 'profile', label: 'Edit Profile', icon: <User size={20} /> },
        { id: 'home', label: 'Home Page', icon: <Home size={20} /> },
        { id: 'about', label: 'About Page', icon: <BookOpen size={20} /> },
        { id: 'education', label: 'Education', icon: <Briefcase size={20} /> },
        { id: 'services', label: 'Services', icon: <Cpu size={20} /> },
        { id: 'skills', label: 'Skills', icon: <Code size={20} /> },
        { id: 'projects', label: 'Projects', icon: <Edit2 size={20} /> },
        { id: 'contact', label: 'Contact Info', icon: <Phone size={20} /> },
        { id: 'messages', label: 'Messages', icon: <MessageSquare size={20} /> },
    ];

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 min-h-screen">
            {/* Mobile Header Bar */}
            <div className="lg:hidden flex items-center justify-between p-4 glass rounded-xl mb-6 border border-white/5">
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    aria-label="Open menu"
                >
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-bold capitalize text-white">{activeTab.replace(/([A-Z])/g, ' $1')} Manager</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 relative">
                {/* Mobile Drawer Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-50 w-64 glass p-6 transform transition-transform duration-300 lg:relative lg:transform-none lg:p-0 lg:z-0 lg:w-64 space-y-2
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="flex justify-between items-center lg:hidden mb-6">
                        <span className="font-bold text-lg text-white">Menu</span>
                        <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-white" aria-label="Close menu">
                            <X size={24} />
                        </button>
                    </div>
                    {sidebarItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setEditItem(null); setIsSidebarOpen(false); }}
                            className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-sky-600 text-white shadow-lg' : 'glass hover:bg-white/10 text-gray-400'}`}
                        >
                            <div className="flex items-center gap-4">
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </div>
                            <ChevronRight size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="w-full flex items-center gap-4 p-4 rounded-xl glass text-red-400 hover:bg-red-500/10 transition-all mt-8"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </aside>

                {/* Main Content Area */}
                <main className="flex-grow w-full glass-card p-4 sm:p-8 lg:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold capitalize">{activeTab.replace(/([A-Z])/g, ' $1')} Manager</h2>
                        {message && <span className="bg-sky-500/20 text-sky-400 px-4 py-2 rounded-lg text-sm">{message}</span>}
                        {['skills', 'projects', 'education', 'services'].includes(activeTab) && !editItem && (
                            <button
                                onClick={() => {
                                    if (activeTab === 'services') {
                                        const nextOrder = data.services.reduce((max, s) => Math.max(max, s.order ?? 0), 0) + 1;
                                        setEditItem({ order: nextOrder });
                                    } else {
                                        setEditItem({});
                                    }
                                }}
                                className="btn-primary flex items-center gap-2 py-2 text-sm"
                            >
                                <Plus size={16} /> Add New
                            </button>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                <form className="space-y-6" onSubmit={(e) => {
                                    e.preventDefault();
                                    handleUpdate('/content/home', data.home);
                                    handleUpdate('/content/about', data.about);
                                    handleUpdate('/contact/info', data.contactInfo);
                                }}>
                                    <div className="flex flex-col md:flex-row gap-8 items-start">
                                        <div className="space-y-4 text-center">
                                            <div className="relative group w-40 h-40 mx-auto">
                                                <img
                                                    src={data.home.heroImage || 'https://via.placeholder.com/150'}
                                                    className="w-full h-full object-cover rounded-3xl border-4 border-sky-500/20 shadow-2xl"
                                                />
                                                <label className="absolute inset-0 flex items-center justify-center bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-3xl">
                                                    <Plus className="text-white" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'home')} />
                                                </label>
                                            </div>
                                            <div>
                                                <h4 className="font-bold">Profile Photo</h4>
                                                <p className="text-xs text-gray-500">Click to change</p>
                                            </div>
                                        </div>

                                        <div className="flex-1 w-full space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm text-gray-400">Full Name / Hero Title</label>
                                                    <input
                                                        className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1"
                                                        value={data.home.heroTitle}
                                                        onChange={(e) => setData({ ...data, home: { ...data.home, heroTitle: e.target.value } })}
                                                        placeholder="e.g. Abdullah Anis"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-gray-400">Professional Title</label>
                                                    <input
                                                        className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1"
                                                        value={data.home.heroSubtitle}
                                                        onChange={(e) => setData({ ...data, home: { ...data.home, heroSubtitle: e.target.value } })}
                                                        placeholder="e.g. Full Stack Developer"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm text-gray-400">Email Address</label>
                                                    <input
                                                        className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1"
                                                        value={data.contactInfo.email}
                                                        onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, email: e.target.value } })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-gray-400">Phone Number</label>
                                                    <input
                                                        className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1"
                                                        value={data.contactInfo.phone}
                                                        onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, phone: e.target.value } })}
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm text-gray-400">Location</label>
                                                    <input
                                                        className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1"
                                                        value={data.about.personalInfo.location}
                                                        onChange={(e) => {
                                                            const val = e.target.value;
                                                            setData({
                                                                ...data,
                                                                about: { ...data.about, personalInfo: { ...data.about.personalInfo, location: val } },
                                                                contactInfo: { ...data.contactInfo, location: val }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm text-gray-400">Availability</label>
                                                    <input
                                                        className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1"
                                                        value={data.about.personalInfo.availability}
                                                        onChange={(e) => setData({ ...data, about: { ...data.about, personalInfo: { ...data.about.personalInfo, availability: e.target.value } } })}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-400">About Me (Bio)</label>
                                                <textarea
                                                    className="w-full glass bg-white/5 p-3 rounded-lg outline-none h-32 mt-1"
                                                    value={data.about.fullBio}
                                                    onChange={(e) => setData({ ...data, about: { ...data.about, fullBio: e.target.value } })}
                                                    placeholder="Write a short biography..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4">
                                        <button type="submit" className="btn-primary w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3">
                                            <Save size={18} /> Update Profile Settings
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                        {/* HOME TAB */}
                        {activeTab === 'home' && (
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleUpdate('/content/home', data.home); }}>
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 p-6 glass rounded-2xl border border-white/5 text-center sm:text-left">
                                        <div className="relative group w-32 h-32">
                                            <img
                                                src={data.home.heroImage || 'https://via.placeholder.com/150'}
                                                className="w-full h-full object-cover rounded-xl border-2 border-sky-500/20"
                                            />
                                            <label className="absolute inset-0 flex items-center justify-center bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                                                <Plus className="text-white" />
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'home')} />
                                            </label>
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Hero Image</h4>
                                            <p className="text-sm text-gray-500 mb-4">Click the image to upload a new one.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-gray-400">Hero Title</label>
                                        <input className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1" value={data.home.heroTitle} onChange={(e) => setData({ ...data, home: { ...data.home, heroTitle: e.target.value } })} />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Hero Subtitle</label>
                                        <textarea className="w-full glass bg-white/5 p-3 rounded-lg outline-none h-24 mt-1" value={data.home.heroSubtitle} onChange={(e) => setData({ ...data, home: { ...data.home, heroSubtitle: e.target.value } })} />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save Home Changes</button>
                            </form>
                        )}

                        {/* ABOUT TAB */}
                        {activeTab === 'about' && (
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleUpdate('/content/about', data.about); }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400">Full Bio / Story</label>
                                        <textarea className="w-full glass bg-white/5 p-3 rounded-lg outline-none h-40 mt-1" value={data.about.fullBio} onChange={(e) => setData({ ...data, about: { ...data.about, fullBio: e.target.value } })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-gray-400">Location</label>
                                            <input className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1" value={data.about.personalInfo.location} onChange={(e) => setData({ ...data, about: { ...data.about, personalInfo: { ...data.about.personalInfo, location: e.target.value } } })} />
                                        </div>
                                        <div>
                                            <label className="text-sm text-gray-400">Availability</label>
                                            <input className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1" value={data.about.personalInfo.availability} onChange={(e) => setData({ ...data, about: { ...data.about, personalInfo: { ...data.about.personalInfo, availability: e.target.value } } })} />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save About Changes</button>
                            </form>
                        )}

                        {/* EDUCATION TAB */}
                        {activeTab === 'education' && (
                            <div className="space-y-6">
                                {editItem && (
                                    <div className="glass p-6 rounded-xl border border-sky-500/30 space-y-4">
                                        <h3 className="font-bold flex justify-between">Add Education <button onClick={() => setEditItem(null)}><X size={18} /></button></h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Institution" onChange={e => setEditItem({ ...editItem, institution: e.target.value })} />
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Degree" onChange={e => setEditItem({ ...editItem, degree: e.target.value })} />
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Field" onChange={e => setEditItem({ ...editItem, field: e.target.value })} />
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Period (e.g. 2018 - 2022)" onChange={e => setEditItem({ ...editItem, period: e.target.value })} />
                                        </div>
                                        <textarea className="w-full glass bg-white/5 p-2 rounded h-20" placeholder="Description" onChange={e => setEditItem({ ...editItem, description: e.target.value })} />
                                        <button onClick={() => handleAddItem('/education', editItem)} className="btn-primary w-full py-2">Create Entry</button>
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {data.education.map(edu => (
                                        <div key={edu._id} className="glass p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div>
                                                <h4 className="font-bold">{edu.degree} in {edu.field}</h4>
                                                <p className="text-sm text-gray-400">{edu.institution} | {edu.period}</p>
                                            </div>
                                            <button onClick={() => handleDelete('/education', edu._id)} className="text-red-400 hover:text-red-500 self-end sm:self-auto"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SERVICES TAB */}
                        {activeTab === 'services' && (
                            <div className="space-y-6">
                                {editItem && (
                                    <div className="glass p-6 rounded-xl border border-sky-500/30 space-y-4">
                                        <h3 className="font-bold flex justify-between">{editItem._id ? 'Edit Service' : 'Add Service'} <button onClick={() => setEditItem(null)}><X size={18} /></button></h3>
                                        <div className="flex items-center gap-4">
                                            <div className="relative group w-16 h-16 border border-white/10 rounded flex items-center justify-center">
                                                {editItem.icon ? <img src={editItem.icon} className="w-full h-full object-cover rounded" /> : <Plus size={20} />}
                                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleImageUpload(e, 'service')} />
                                            </div>
                                            <p className="text-xs text-gray-500">Upload service icon/image</p>
                                        </div>
                                        <input className="w-full glass bg-white/5 p-2 rounded" placeholder="Service Title" value={editItem.title || ''} onChange={e => setEditItem({ ...editItem, title: e.target.value })} />
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full glass bg-white/5 p-2 rounded"
                                            placeholder="Display order (1 = first)"
                                            value={editItem.order ?? ''}
                                            onChange={e => setEditItem({ ...editItem, order: e.target.value === '' ? undefined : Number(e.target.value) })}
                                        />
                                        <textarea className="w-full glass bg-white/5 p-2 rounded h-20" placeholder="Description" value={editItem.description || ''} onChange={e => setEditItem({ ...editItem, description: e.target.value })} />
                                        <button onClick={() => handleAddItem('/services', editItem)} className="btn-primary w-full py-2">{editItem._id ? 'Update Service' : 'Create Service'}</button>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.services.map(svc => (
                                        <div key={svc._id} className="glass p-4 rounded-lg flex justify-between items-center group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-sky-500/10 rounded flex items-center justify-center text-xl overflow-hidden">
                                                    {svc.icon && (svc.icon.startsWith('http') || svc.icon.startsWith('/uploads'))
                                                        ? <img src={svc.icon.startsWith('http') ? svc.icon : `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}${svc.icon}`} alt="" className="w-full h-full object-cover rounded" />
                                                        : (svc.icon || '🚀')}
                                                </div>
                                                <div>
                                                    <span className="font-bold">{svc.title}</span>
                                                    {svc.order != null && (
                                                        <p className="text-xs text-gray-500">Order: {svc.order}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditItem(svc)} className="text-gray-400 hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={18} /></button>
                                                <button onClick={() => handleDelete('/services', svc._id)} className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* SKILLS TAB */}
                        {activeTab === 'skills' && (
                            <div className="space-y-6">
                                {editItem && (
                                    <div className="glass p-6 rounded-xl border border-sky-500/30 space-y-4">
                                        <h3 className="font-bold flex justify-between">{editItem._id ? 'Edit Skill' : 'Add New Skill'} <button onClick={() => setEditItem(null)}><X size={18} /></button></h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Skill Name" value={editItem.name || ''} onChange={e => setEditItem({ ...editItem, name: e.target.value })} />
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Category (e.g. Frontend)" value={editItem.category || ''} onChange={e => setEditItem({ ...editItem, category: e.target.value })} />
                                            <input type="number" className="glass bg-white/5 p-2 rounded" placeholder="Proficiency %" value={editItem.proficiency || ''} onChange={e => setEditItem({ ...editItem, proficiency: e.target.value })} />
                                        </div>
                                        <button onClick={() => handleAddItem('/skills', editItem)} className="btn-primary w-full py-2">{editItem._id ? 'Update Skill' : 'Create Skill'}</button>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {data.skills.map(skill => (
                                        <div key={skill._id} className="glass p-4 rounded-lg flex justify-between items-center group">
                                            <div>
                                                <span className="font-bold">{skill.name}</span>
                                                <span className="text-xs text-gray-500 ml-2">({skill.category})</span>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <span className="text-sky-400 font-bold">{skill.proficiency}%</span>
                                                <button onClick={() => setEditItem(skill)} className="text-gray-400 hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={16} /></button>
                                                <button onClick={() => handleDelete('/skills', skill._id)} className="text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PROJECTS TAB */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6">
                                {editItem && (
                                    <div className="glass p-6 rounded-xl border border-sky-500/30 space-y-4">
                                        <h3 className="font-bold flex justify-between">{editItem._id ? 'Edit Project' : 'Add Project'} <button onClick={() => setEditItem(null)}><X size={18} /></button></h3>
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 p-4 glass rounded-xl border border-white/5 text-center sm:text-left">
                                            <div className="relative group w-24 h-24">
                                                <img
                                                    src={editItem.image || 'https://via.placeholder.com/150'}
                                                    className="w-full h-full object-cover rounded-lg border-2 border-sky-500/20"
                                                />
                                                <label className="absolute inset-0 flex items-center justify-center bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg">
                                                    <Plus className="text-white" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'project')} />
                                                </label>
                                            </div>
                                            <p className="text-sm text-gray-500">Upload Project Thumbnail</p>
                                        </div>
                                        <input className="w-full glass bg-white/5 p-2 rounded" placeholder="Project Title" value={editItem.title || ''} onChange={e => setEditItem({ ...editItem, title: e.target.value })} />
                                        <textarea className="w-full glass bg-white/5 p-2 rounded h-20" placeholder="Description" value={editItem.description || ''} onChange={e => setEditItem({ ...editItem, description: e.target.value })} />
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Category" value={editItem.category || ''} onChange={e => setEditItem({ ...editItem, category: e.target.value })} />
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Tech (comma separated)" value={editItem.technologies?.join(', ') || ''} onChange={e => setEditItem({ ...editItem, technologies: e.target.value.split(',').map(t => t.trim()) })} />
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="GitHub URL" value={editItem.githubUrl || ''} onChange={e => setEditItem({ ...editItem, githubUrl: e.target.value })} />
                                            <input className="glass bg-white/5 p-2 rounded" placeholder="Live Demo URL" value={editItem.liveUrl || ''} onChange={e => setEditItem({ ...editItem, liveUrl: e.target.value })} />
                                        </div>
                                        <button onClick={() => handleAddItem('/projects', editItem)} className="btn-primary w-full py-2">{editItem._id ? 'Update Project' : 'Create Project'}</button>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {data.projects.map(project => (
                                        <div key={project._id} className="glass p-4 rounded-lg flex justify-between items-center group">
                                            <div className="flex items-center gap-4">
                                                <img src={project.image || 'https://via.placeholder.com/50'} className="w-12 h-12 rounded object-cover" />
                                                <div>
                                                    <h4 className="font-bold">{project.title}</h4>
                                                    <p className="text-xs text-gray-500">{project.category}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => setEditItem(project)} className="text-gray-400 hover:text-sky-400 opacity-0 group-hover:opacity-100 transition-all"><Edit2 size={18} /></button>
                                                <button onClick={() => handleDelete('/projects', project._id)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CONTACT INFO TAB */}
                        {activeTab === 'contact' && (
                            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleUpdate('/contact/info', data.contactInfo); }}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="text-sm text-gray-400">Email Address</label>
                                        <input className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1" value={data.contactInfo.email} onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, email: e.target.value } })} />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-400">Phone Number</label>
                                        <input className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1" value={data.contactInfo.phone} onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, phone: e.target.value } })} />
                                    </div>
                                    <div className="col-span-1 sm:col-span-2">
                                        <label className="text-sm text-gray-400">Location</label>
                                        <input className="w-full glass bg-white/5 p-3 rounded-lg outline-none mt-1" value={data.contactInfo.location} onChange={(e) => setData({ ...data, contactInfo: { ...data.contactInfo, location: e.target.value } })} />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary flex items-center gap-2"><Save size={18} /> Save Contact Info</button>
                            </form>
                        )}

                        {/* MESSAGES TAB */}
                        {activeTab === 'messages' && (
                            <div className="space-y-4">
                                {data.messages.length === 0 && <p className="text-center text-gray-500">No messages yet.</p>}
                                {data.messages.map(msg => (
                                    <div key={msg._id} className="glass p-6 rounded-xl border border-white/5 space-y-4">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div>
                                                <h4 className="font-bold">{msg.name}</h4>
                                                <p className="text-sm text-gray-400">{msg.email}</p>
                                                <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${msg.status === 'unread' ? 'bg-sky-500/20 text-sky-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                                    {msg.status}
                                                </span>
                                                <button onClick={() => handleDelete('/contact/messages', msg._id)} className="text-red-400 hover:text-red-500"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-white/5 rounded-lg">
                                            <p className="text-sm font-bold text-sky-400 mb-1">Subject: {msg.subject}</p>
                                            <p className="text-gray-300 italic">"{msg.message}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
