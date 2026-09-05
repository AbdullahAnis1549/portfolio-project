const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
    siteTitle: String,
    siteDescription: String,
    logo: String,
    themeColors: {
        primary: String,
        secondary: String
    }
});

module.exports = mongoose.model('Setting', SettingSchema);
