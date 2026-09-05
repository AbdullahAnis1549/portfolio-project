const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    title: String,
    description: String,
    icon: String,
    order: Number
});

module.exports = mongoose.model('Service', ServiceSchema);
