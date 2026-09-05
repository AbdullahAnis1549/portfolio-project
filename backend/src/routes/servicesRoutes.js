const express = require('express');
const router = express.Router();
const { getServices, createService, updateService, deleteService } = require('../controllers/servicesController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(getServices)
    .post(protect, createService);

router.route('/:id')
    .put(protect, updateService)
    .delete(protect, deleteService);

module.exports = router;
