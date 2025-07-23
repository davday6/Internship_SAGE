const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: String,
  date: String,
  rating: { type: Number, min: 1, max: 5 },
  comment: String
});

const agentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  domains: [{ type: String, required: true }], // Changed to array
  subdomains: [{ type: String, required: true }], // Changed to array
  description: { type: String, required: true },
  rating: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  commentUrl: { type: String, default: null },
  trialUrl: { type: String, default: null },
  documentationUrl: { type: String, default: null },
  version: { type: String, default: '1.0' },
  reviewsList: [reviewSchema]
}, {
  timestamps: true,
  collection: 'agents' // Specify the collection name
});

// Create index for search functionality
agentSchema.index({ title: 'text', description: 'text', domains: 'text', subdomains: 'text' });

module.exports = mongoose.model('Agent', agentSchema); 