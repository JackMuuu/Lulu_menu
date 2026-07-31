const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    dish: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ dish: 1, createdAt: -1 });
reviewSchema.index({ dish: 1, rating: -1 });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);