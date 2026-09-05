const Home = require('../models/Home');

// @desc    Get home content
// @route   GET /api/content/home
// @access  Public
const getHomeContent = async (req, res) => {
    try {
        let home = await Home.findOne();
        if (!home) {
            home = await Home.create({
                heroTitle: 'Welcome to My Portfolio',
                heroSubtitle: 'I am a Full Stack Developer',
                heroImage: '',
                ctaButtons: { projects: 'View Projects', contact: 'Contact Me' }
            });
        }
        res.json(home);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update home content
// @route   PUT /api/content/home
// @access  Private/Admin
const updateHomeContent = async (req, res) => {
    try {
        const home = await Home.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(home);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getHomeContent, updateHomeContent };
