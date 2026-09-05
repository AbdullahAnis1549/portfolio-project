const Skill = require('../models/Skill');

const getSkills = async (req, res) => {
    try {
        const skills = await Skill.find().sort('order');
        res.json(skills);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSkill = async (req, res) => {
    try {
        const skill = await Skill.create(req.body);
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSkill = async (req, res) => {
    try {
        const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(skill);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id);
        res.json({ message: 'Skill removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
