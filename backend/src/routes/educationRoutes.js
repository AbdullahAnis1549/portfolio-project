const express = require('express');
const router = express.Router();
const { getEducation, createEducation, updateEducation, deleteEducation } = require('../controllers/educationController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getEducation)
    .post(protect, createEducation);

router.route('/:id')
    .put(protect, updateEducation)
    .delete(protect, deleteEducation);

module.exports = router;
