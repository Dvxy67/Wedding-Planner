const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true }
});

module.exports = mongoose.model('Wedding', weddingSchema);
