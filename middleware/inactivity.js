const Session = require('../models/Session');
const { hashToken } = require('../utils/jwt');
const { getSessionDurationMs } = require('../utils/timer');

async function touchSessionFromCookie(req) {
  const token = req.cookies?.menu_session;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await Session.findOne({
    tokenHash,
    revokedAt: null,
  });

  if (!session) return null;

  const now = new Date();
  if (session.expiresAt <= now) {
    session.revokedAt = now;
    await session.save();
    return null;
  }

  session.lastActiveAt = now;
  session.expiresAt = new Date(Date.now() + getSessionDurationMs());
  await session.save();
  return session;
}

module.exports = { touchSessionFromCookie };