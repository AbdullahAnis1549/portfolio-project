const express = require('express');
const router = express.Router();
const { getContactInfo, updateContactInfo, sendMessage, getMessages, updateMessageStatus, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

router.get('/info', getContactInfo);
router.put('/info', protect, updateContactInfo);
router.post('/send-message', sendMessage);
router.get('/messages', protect, getMessages);
router.put('/messages/:id', protect, updateMessageStatus);
router.delete('/messages/:id', protect, deleteMessage);

module.exports = router;
