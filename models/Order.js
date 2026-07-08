const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  dish: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: true,
  },
  nameSnapshot: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  imageSnapshot: {
    type: String,
    default: '',
  },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNo: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  items: {
    type: [orderItemSchema],
    required: true,
    default: [],
  },
  note: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);