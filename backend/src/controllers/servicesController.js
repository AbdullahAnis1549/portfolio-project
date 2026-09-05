const Service = require('../models/Service');

const getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1, _id: 1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createService = async (req, res) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(service);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getServices, createService, updateService, deleteService };
