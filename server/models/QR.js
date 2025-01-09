const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', unique: true },
    qrCode: { type: String, required: true },
});

module.exports = mongoose.model('QR', qrSchema);
