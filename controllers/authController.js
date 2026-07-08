const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Session = require('../models/Session');
const { createSessionToken, hashToken } = require('../utils/jwt');
const { getSessionDurationMs } = require('../utils/timer');

function safeUser(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar || '',
    role: user.role || 'user',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: getSessionDurationMs(),
    path: '/',
  };
}

async function createSessionForUser(user, req) {
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const now = new Date();

  await Session.create({
    user: user._id,
    tokenHash,
    createdAt: now,
    lastActiveAt: now,
    expiresAt: new Date(Date.now() + getSessionDurationMs()),
    userAgent: req.headers['user-agent'] || '',
    ip: req.ip || req.socket?.remoteAddress || '',
  });

  return token;
}

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'username, email, and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(String(password), 12);

    const user = await User.create({
      username: String(username).trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'user',
    });

    const token = await createSessionForUser(user, req);
    res.cookie('menu_session', token, sessionCookieOptions());

    return res.status(201).json({
      ok: true,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = await createSessionForUser(user, req);
    res.cookie('menu_session', token, sessionCookieOptions());

    return res.json({
      ok: true,
      user: safeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const token = req.cookies?.menu_session;
    if (token) {
      await Session.updateOne(
        { tokenHash: hashToken(token) },
        { $set: { revokedAt: new Date(), expiresAt: new Date() } }
      );
    }

    res.clearCookie('menu_session', { path: '/' });
    return res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not signed in' });
  }

  return res.json({
    ok: true,
    user: safeUser(req.user),
  });
};

exports.adminLogin = async (req, res) => {
  const { password } = req.body || {};
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD not configured on server' });
  }
  if (String(password || '') === String(process.env.ADMIN_PASSWORD)) {
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false, error: 'Invalid password' });
};