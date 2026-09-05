const express = require('express');
const router = express.Router();
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controllers/skillsController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getSkills)
    .post(protect, createSkill);

router.route('/:id')
    .put(protect, updateSkill)
    .delete(protect, deleteSkill);

module.exports = router;
