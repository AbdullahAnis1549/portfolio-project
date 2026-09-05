const express = require('express');
const router = express.Router();
const { uploadImage, getMedia, deleteMedia } = require('../controllers/mediaController');
const { protect } = require('../middleware/auth');
const upload = require('../utils/upload');

router.post('/upload', protect, upload.single('image'), uploadImage);
router.get('/', protect, getMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
