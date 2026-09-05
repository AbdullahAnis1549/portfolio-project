const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
    institution: String,
    degree: String,
    field: String,
    period: String,
    description: String,
    order: Number
});

module.exports = mongoose.model('Education', EducationSchema);
