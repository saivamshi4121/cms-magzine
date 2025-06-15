const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const auth = require('../middleware/auth');

// ✅ Create a new issue (admin only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admins only' });
  }

  try {
    const { title, description, month, year } = req.body;
    const issue = new Issue({ title, description, month, year });
    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get all issues
router.get('/', async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single issue by ID
router.get('/:id', async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ msg: 'Not found' });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update issue (admin only)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admins only' });
  }

  try {
    const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete issue (admin only)
router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Admins only' });
  }

  try {
    await Issue.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
