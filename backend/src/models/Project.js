const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    technologies: [String],
    category: String,
    githubUrl: String,
    liveUrl: String,
    featured: { type: Boolean, default: false },
    order: Number
});

module.exports = mongoose.model('Project', ProjectSchema);
