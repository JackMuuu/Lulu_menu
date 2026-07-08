// server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { connectDB } = require('./db/connection');
const dishesRouter = require('./routes/dishes');
const authRouter = require('./routes/auth');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const profileRouter = require('./routes/profile');
const adminRouter = require('./routes/admin');
const Session = require('./models/Session');
const { attachUser } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Basic-auth protect admin.html (no external deps)
function requireAdminBasicAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required.');
  }

  const [scheme, encoded] = auth.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'basic' || !encoded) {
    return res.status(400).send('Bad authorization header.');
  }

  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const idx = decoded.indexOf(':');
  if (idx === -1) return res.status(400).send('Bad authorization value.');

  const username = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);

  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASS || '';

  if (username === expectedUser && password === expectedPass) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials.');
}

// Security & basics
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(attachUser);

// Static files
app.use(express.static(path.join(__dirname)));

// Protect admin.html route
app.get('/admin.html', requireAdminBasicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// API routes
app.use('/api/dishes', dishesRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/admin', adminRouter);

// Fallback to index.html for client routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// Basic 404 for unmatched API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

async function cleanupExpiredSessions() {
  try {
    const now = new Date();
    await Session.deleteMany({ expiresAt: { $lte: now } });
  } catch (err) {
    console.warn('Session cleanup skipped:', err.message);
  }
}

// Start server after DB connects
async function start() {
  try {
    await connectDB();
    await cleanupExpiredSessions();
    setInterval(cleanupExpiredSessions, 10 * 60 * 1000).unref();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown hooks
process.on('SIGINT', () => {
  console.log('SIGINT received — exiting');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received — exiting');
  process.exit(0);
});