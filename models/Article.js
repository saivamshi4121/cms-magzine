const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  issue: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  slug: String,
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
