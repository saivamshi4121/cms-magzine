const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  const user = new User({ username, password: await bcrypt.hash(password, 10), role });
  await user.save();
  res.json({ msg: 'User registered' });
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

  const payload = { user: { id: user._id, role: user.role } };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token });
});

module.exports = router;
