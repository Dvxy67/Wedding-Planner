const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rsvp: { type: Boolean, default: false },
  status: { type: String, enum: ['invité', 'confirmé', 'annulé'], default: 'invité' },
  weddingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Wedding', required: true }
});

module.exports = mongoose.model('Guest', guestSchema);
