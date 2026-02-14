// server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');


const { connectDB } = require('./db/connection');
const dishesRouter = require('./routes/dishes');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;



// Basic-auth protect admin.html (no external deps)
function requireAdminBasicAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) {
    // ask browser to prompt
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).send('Authentication required.');
  }

  const [scheme, encoded] = auth.split(' ');
  if (!scheme || scheme.toLowerCase() !== 'basic' || !encoded) {
    return res.status(400).send('Bad authorization header.');
  }

  // decode "username:password"
  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const idx = decoded.indexOf(':');
  if (idx === -1) return res.status(400).send('Bad authorization value.');

  const username = decoded.slice(0, idx);
  const password = decoded.slice(idx + 1);

  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASS || '';

  // timing-safe comparison recommended for production; keep simple here
  if (username === expectedUser && password === expectedPass) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).send('Invalid credentials.');
}

// Protect admin.html route
app.get('/admin.html', requireAdminBasicAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});




// Security & basics
app.use(cors());                // allow cross-origin requests (adjust if you need restrictive config)
app.use(express.json());        // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse urlencoded bodies (forms)


// ---- Static files ----
// Serve the current folder (your index.html, admin.html, assets, etc.)
app.use(express.static(path.join(__dirname)));


// ---- API routes ----
app.use('/api/dishes', dishesRouter);

// after your other app.use(...) and before the catch-all:
app.use(express.json()); // ensure body parsing is enabled
app.use('/api', authRouter); // this makes endpoint POST /api/admin-login






// ---- Fallback to index.html for client routing ----
// Only serve index.html for non-API requests that weren't found by static middleware
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// ---- Basic 404 for unmatched API routes ----
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// ---- Error handler ----
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && err.stack ? err.stack : err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// ---- Start server after DB connects ----
async function start() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();

// Graceful shutdown hooks (helpful on some hosts)
process.on('SIGINT', () => {
  console.log('SIGINT received — exiting');
  process.exit(0);
});
process.on('SIGTERM', () => {
  console.log('SIGTERM received — exiting');
  process.exit(0);
});