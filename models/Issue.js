const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  title: String,
  description: String,
  month: Number,
  year: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Issue', IssueSchema);
