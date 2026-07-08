const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.me);

// keep your old admin JSON login route
router.post('/admin-login', authController.adminLogin);

module.exports = router;