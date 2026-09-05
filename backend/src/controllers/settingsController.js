const Setting = require('../models/Setting');

const getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = await Setting.create({ siteTitle: 'My Portfolio', siteDescription: 'Developer Portfolio', logo: '', themeColors: { primary: '#000', secondary: '#fff' } });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSettings, updateSettings };
