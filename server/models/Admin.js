const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHashed: { type: String, required: true },
});

module.exports = mongoose.model('Admin', AdminSchema);
