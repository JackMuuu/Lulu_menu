const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
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
    default: '',
    trim: true,
    maxlength: 1000,
  },
}, { timestamps: true });

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);