const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

router.post('/', requireAuth, reviewController.createReview);
router.get('/mine', requireAuth, reviewController.getMyReviews);

module.exports = router;