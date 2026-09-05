const express = require('express');
const router = express.Router();
const { getHomeContent, updateHomeContent } = require('../controllers/homeController');
const { protect } = require('../middleware/auth');

router.get('/home', getHomeContent);
router.put('/home', protect, updateHomeContent);

module.exports = router;
