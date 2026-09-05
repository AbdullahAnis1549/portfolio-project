const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    heroTitle: String,
    heroSubtitle: String,
    heroImage: String,
    ctaButtons: {
        projects: { type: String, default: 'View Projects' },
        contact: { type: String, default: 'Contact Me' }
    }
});

module.exports = mongoose.model('Home', HomeSchema);
