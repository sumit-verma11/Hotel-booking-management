const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkInDate: { type: Date, required: true },
  numberOfGuests: { type: Number, required: true },
  status: { type: Number, default: 0 },
  bookingDate: { type: Date, default: Date.now },
  specialRequests: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
