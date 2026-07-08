const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  tokenHash: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActiveAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
  revokedAt: {
    type: Date,
    default: null,
  },
  userAgent: {
    type: String,
    default: '',
  },
  ip: {
    type: String,
    default: '',
  },
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.models.Session || mongoose.model('Session', sessionSchema);