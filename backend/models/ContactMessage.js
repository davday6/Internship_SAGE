const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['new', 'read', 'responded', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true,
  collection: 'contact_messages'
});

// Create index for searching through messages
contactMessageSchema.index({ email: 1, createdAt: -1 });
contactMessageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
