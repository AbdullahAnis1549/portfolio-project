const mongoose = require('mongoose');

const ContactInfoSchema = new mongoose.Schema({
    email: String,
    phone: String,
    location: String,
    socialLinks: [{
        platform: String,
        url: String,
        icon: String
    }]
});

module.exports = mongoose.model('ContactInfo', ContactInfoSchema);
