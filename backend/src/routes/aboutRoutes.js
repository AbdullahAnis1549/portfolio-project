const express = require('express');
const router = express.Router();
const { getAboutContent, updateAboutContent } = require('../controllers/aboutController');
const { protect } = require('../middleware/auth');

router.get('/about', getAboutContent);
router.put('/about', protect, updateAboutContent);

module.exports = router;
