const mongoose = require('mongoose');

const EasyboxReservationSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  reservationDate: { type: Date, required: true },
  state: { type: String, required: true }
});

module.exports = mongoose.model('EasyboxReservation', EasyboxReservationSchema);
