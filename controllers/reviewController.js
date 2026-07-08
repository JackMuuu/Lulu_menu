const Review = require('../models/Review');
const Dish = require('../models/Dish');

exports.createReview = async (req, res, next) => {
  try {
    const { dishId, rating, comment = '' } = req.body || {};

    if (!dishId || !rating) {
      return res.status(400).json({ error: 'dishId and rating are required' });
    }

    const dish = await Dish.findById(dishId).lean();
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    const review = await Review.create({
      user: req.user._id,
      dish: dish._id,
      rating: Number(rating),
      comment: String(comment).trim(),
    });

    return res.status(201).json({ ok: true, review });
  } catch (err) {
    next(err);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, reviews });
  } catch (err) {
    next(err);
  }
};