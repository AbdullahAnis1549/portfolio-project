const Education = require('../models/Education');

const getEducation = async (req, res) => {
    try {
        const education = await Education.find().sort('order');
        res.json(education);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEducation = async (req, res) => {
    try {
        const education = await Education.create(req.body);
        res.status(201).json(education);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEducation = async (req, res) => {
    try {
        const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(education);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEducation = async (req, res) => {
    try {
        await Education.findByIdAndDelete(req.params.id);
        res.json({ message: 'Education removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEducation, createEducation, updateEducation, deleteEducation };
