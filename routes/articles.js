const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const auth = require('../middleware/auth');

// ✅ Create a new article (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, tags, issue, slug, status } = req.body;
    const article = new Article({
      title,
      content,
      tags,
      issue,
      slug,
      status,
      author: req.user.id,
    });
    await article.save();
    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all published articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({ status: 'published' })
      .populate('author', 'username')
      .populate('issue', 'title month year')
      .sort({ createdAt: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'username')
      .populate('issue', 'title');
    if (!article) return res.status(404).json({ msg: 'Not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update article (only by author or admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Not found' });

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    Object.assign(article, req.body);
    await article.save();
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete article (author or admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ msg: 'Not found' });

    if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await article.deleteOne();
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 