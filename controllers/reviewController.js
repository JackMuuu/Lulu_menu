const mongoose = require('mongoose');
const Review = require('../models/Review');
const Dish = require('../models/Dish');

function getSortObject(sort) {
  switch (sort) {
    case 'oldest':
      return { createdAt: 1 };
    case 'highest':
      return { rating: -1, createdAt: -1 };
    case 'lowest':
      return { rating: 1, createdAt: -1 };
    case 'newest':
    default:
      return { createdAt: -1 };
  }
}

async function calculateDishRatingSummary(dishId) {
  const [summary] = await Review.aggregate([
    { $match: { dish: new mongoose.Types.ObjectId(dishId) } },
    {
      $group: {
        _id: '$dish',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const averageRating = summary ? Number(summary.averageRating.toFixed(2)) : 0;
  const reviewCount = summary ? summary.reviewCount : 0;

  await Dish.findByIdAndUpdate(dishId, {
    ratingAverage: averageRating,
    ratingCount: reviewCount,
  });

  return { averageRating, reviewCount };
}

exports.getDishReviews = async (req, res, next) => {
  try {
    const { dishId } = req.params;
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '10', 10)));
    const sort = String(req.query.sort || 'newest');
    const rating = req.query.rating ? parseInt(req.query.rating, 10) : null;

    if (!mongoose.isValidObjectId(dishId)) {
      return res.status(400).json({ error: 'Invalid dishId' });
    }

    const filter = { dish: dishId };
    if (Number.isInteger(rating) && rating >= 1 && rating <= 5) {
      filter.rating = rating;
    }

    const sortObj = getSortObject(sort);

    const [summary, totalCount, reviews] = await Promise.all([
      Review.aggregate([
        { $match: { dish: new mongoose.Types.ObjectId(dishId) } },
        {
          $group: {
            _id: '$dish',
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 },
          },
        },
      ]),
      Review.countDocuments(filter),
      Review.find(filter)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('user', '_id username avatar')
        .lean(),
    ]);

    const currentUserId = req.user ? String(req.user._id) : null;

      reviews.forEach((review) => {

      review.isMine =
        !!currentUserId &&
        review.user &&
        String(review.user._id || review.user) === currentUserId;
    });

    const stats = summary[0]
      ? {
          averageRating: Number(summary[0].averageRating.toFixed(2)),
          reviewCount: summary[0].reviewCount,
        }
      : {
          averageRating: 0,
          reviewCount: 0,
        };

    return res.json({
      ok: true,
      reviews,
      page,
      limit,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      stats,
    });
  } catch (err) {
    next(err);
  }
};

exports.createReview = async (req, res, next) => {
  try {
    const { dishId, rating, comment = '' } = req.body || {};
    const parsedRating = Number(rating);

    if (!mongoose.isValidObjectId(dishId)) {
      return res.status(400).json({ error: 'Valid dishId is required' });
    }

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer from 1 to 5' });
    }

    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({ error: 'Dish not found' });
    }

    const uploadedImages = Array.isArray(req.files) ? req.files.slice(0, 3) : [];
    const imagePaths = uploadedImages.map((file) => `/uploads/reviews/${file.filename}`);

    const review = await Review.create({
      dish: dish._id,
      user: req.user._id,
      rating: parsedRating,
      comment: String(comment).trim(),
      images: imagePaths,
    });

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username avatar')
      .lean();

    const stats = await calculateDishRatingSummary(dishId);

    return res.status(201).json({
      ok: true,
      review: populatedReview,
      stats,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteMyReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    if (!mongoose.isValidObjectId(reviewId)) {
      return res.status(400).json({ error: 'Invalid reviewId' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    if (String(review.user) !== String(req.user._id)) {
      return res.status(403).json({ error: 'You can only delete your own review' });
    }

    const dishId = review.dish;

    await Review.deleteOne({ _id: reviewId });

    const stats = await calculateDishRatingSummary(dishId);

    return res.json({
      ok: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('dish', 'name image category')
      .lean();

    return res.json({
      ok: true,
      reviews,
    });
  } catch (err) {
    next(err);
  }
};