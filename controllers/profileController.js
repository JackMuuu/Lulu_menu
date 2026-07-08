const Order = require('../models/Order');
const Review = require('../models/Review');

exports.getProfile = async (req, res) => {
  return res.json({
    ok: true,
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar || '',
      role: req.user.role || 'user',
    },
  });
};

exports.getOrderHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, orders });
  } catch (err) {
    next(err);
  }
};

exports.getReviewHistory = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ok: true, reviews });
  } catch (err) {
    next(err);
  }
};