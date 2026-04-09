const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['à faire', 'en cours', 'terminé'],
    default: 'à faire'
  },
  wedding: { type: mongoose.Schema.Types.ObjectId, ref: 'Wedding', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
