const ContactInfo = require('../models/ContactInfo');
const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');

const getContactInfo = async (req, res) => {
    try {
        let info = await ContactInfo.findOne();
        if (!info) {
            info = await ContactInfo.create({ email: 'test@example.com', phone: '123', location: 'Earth', socialLinks: [] });
        }
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateContactInfo = async (req, res) => {
    try {
        const info = await ContactInfo.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendMessage = async (req, res) => {
    try {
        const message = await ContactMessage.create(req.body);

        // Send email notification
        try {
            await sendEmail({
                subject: `New Message from ${req.body.name}: ${req.body.subject}`,
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #6366f1;">New Portfolio Inquiry</h2>
            <hr style="border: 0; border-top: 1px solid #eee;">
            <p><strong>Name:</strong> ${req.body.name}</p>
            <p><strong>Email:</strong> ${req.body.email}</p>
            <p><strong>Subject:</strong> ${req.body.subject}</p>
            <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 10px;">
              <p><strong>Message:</strong></p>
              <p>${req.body.message}</p>
            </div>
            <p style="font-size: 12px; color: #888; margin-top: 20px;">This message was sent from your portfolio contact form.</p>
          </div>
        `,
            });
        } catch (emailError) {
            console.error('Email could not be sent:', emailError);
        }

        res.status(201).json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort('-createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMessageStatus = async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(message);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteMessage = async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getContactInfo, updateContactInfo, sendMessage, getMessages, updateMessageStatus, deleteMessage };
