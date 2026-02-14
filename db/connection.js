// db/connection.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('MONGO_URI must be set in .env');
}

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

async function connectDB() {
  if (mongoose.connection.readyState >= 1) return mongoose.connection;
  return mongoose.connect(MONGO_URI, opts);
}

module.exports = { connectDB, mongoose };