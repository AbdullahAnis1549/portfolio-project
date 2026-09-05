const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    name: String,
    category: {
        type: String
    },
    proficiency: { type: Number, min: 0, max: 100 },
    icon: String,
    order: Number
});

module.exports = mongoose.model('Skill', SkillSchema);
