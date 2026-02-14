// models/Dish.js (CommonJS)
const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: { type: String, default: '' },
  category: { type: String, enum: ['热菜','凉菜','汤品','主食','甜品','饮品', '特别'], required: true, index: true },
  image: { type: String, default: '' },        // secure_url from Cloudinary
  imagePublicId: { type: String, default: ''}, // Cloudinary public_id (for deletion)
  createdAt: { type: Date, default: Date.now }
});

dishSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.models?.Dish || mongoose.model('Dish', dishSchema);