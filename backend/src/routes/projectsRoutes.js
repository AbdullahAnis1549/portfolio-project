const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, deleteProject } = require('../controllers/projectsController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getProjects)
    .post(protect, createProject);

router.route('/:id')
    .put(protect, updateProject)
    .delete(protect, deleteProject);

module.exports = router;
