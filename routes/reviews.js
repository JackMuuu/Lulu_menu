const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const { requireAuth } = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

const uploadDir = path.join(__dirname, '..', 'uploads', 'reviews');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const safeExt = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}${safeExt}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    files: 3,
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

router.get('/mine', requireAuth, reviewController.getMyReviews);
router.get('/dish/:dishId', reviewController.getDishReviews);
router.post('/', requireAuth, upload.array('images', 3), reviewController.createReview);
router.delete('/:reviewId', requireAuth, reviewController.deleteMyReview);

module.exports = router;