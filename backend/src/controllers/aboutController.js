const About = require('../models/About');

const getAboutContent = async (req, res) => {
    try {
        let about = await About.findOne();
        if (!about) {
            about = await About.create({ bio: 'Bio...', fullBio: 'Full bio...', personalInfo: { location: 'Earth', availability: 'Full-time' } });
        }
        res.json(about);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAboutContent = async (req, res) => {
    try {
        const about = await About.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(about);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getAboutContent, updateAboutContent };
