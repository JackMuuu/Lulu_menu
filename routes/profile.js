const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const profileController = require('../controllers/profileController');

router.get('/me', requireAuth, profileController.getProfile);
router.get('/orders', requireAuth, profileController.getOrderHistory);

module.exports = router;