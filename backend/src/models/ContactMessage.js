const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
    name: String,
    email: String,
    subject: String,
    message: String,
    status: {
        type: String,
        enum: ['unread', 'read', 'replied', 'archived'],
        default: 'unread'
    },
    adminNotes: String,
    repliedAt: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);
