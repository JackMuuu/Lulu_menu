const Session = require('../models/Session');
const { hashToken } = require('../utils/jwt');
const { getSessionDurationMs } = require('../utils/timer');

async function attachUser(req, res, next) {
  try {
    const token = req.cookies?.menu_session;
    if (!token) {
      req.user = null;
      req.sessionDoc = null;
      return next();
    }

    const tokenHash = hashToken(token);

    const sessionDoc = await Session.findOne({
      tokenHash,
      revokedAt: null,
    }).populate('user');

    if (!sessionDoc) {
      res.clearCookie('menu_session', { path: '/' });
      req.user = null;
      req.sessionDoc = null;
      return next();
    }

    if (sessionDoc.expiresAt && sessionDoc.expiresAt.getTime() <= Date.now()) {
      await Session.deleteOne({ _id: sessionDoc._id });
      res.clearCookie('menu_session', { path: '/' });
      req.user = null;
      req.sessionDoc = null;
      return next();
    }

    sessionDoc.lastActiveAt = new Date();
    sessionDoc.expiresAt = new Date(Date.now() + getSessionDurationMs());
    await sessionDoc.save();

    req.sessionDoc = sessionDoc;
    req.user = sessionDoc.user;
    res.locals.currentUser = sessionDoc.user;

    return next();
  } catch (err) {
    return next(err);
  }
}

function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  return next();
}

module.exports = { attachUser, requireAuth, requireAdmin };