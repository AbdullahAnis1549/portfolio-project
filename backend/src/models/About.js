const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
    bio: String,
    fullBio: String,
    personalInfo: {
        location: String,
        availability: String
    }
});

module.exports = mongoose.model('About', AboutSchema);
