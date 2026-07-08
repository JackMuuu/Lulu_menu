const express = require('express');
const router = express.Router();
const { attachUser, requireAdmin } = require('../middleware/auth');

router.use(attachUser);

router.get('/health', requireAdmin, (req, res) => {
  res.json({ ok: true, user: { id: req.user._id, username: req.user.username, role: req.user.role } });
});

module.exports = router;
