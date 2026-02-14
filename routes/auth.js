// routes/auth.js
const express = require('express');
const router = express.Router();
require('dotenv').config();

// POST /admin-login
router.post('/admin-login', (req, res) => {
  const { password } = req.body || {};
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server' });
  }
  if (String(password || '') === String(process.env.ADMIN_PASSWORD)) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Invalid password' });
});

module.exports = router;