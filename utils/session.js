const crypto = require('crypto');

const SESSION_COOKIE_NAME = 'menu_sid';
const SESSION_TIMEOUT_MINUTES = Number(process.env.SESSION_TIMEOUT_MINUTES || 30);
const SESSION_TIMEOUT_MS = SESSION_TIMEOUT_MINUTES * 60 * 1000;

function newSessionId() {
  return crypto.randomBytes(32).toString('hex');
}

function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return acc;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) return acc;
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function getSidFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || '');
  return cookies[SESSION_COOKIE_NAME] || '';
}

function cookieOptions() {
  const secure = String(process.env.COOKIE_SECURE || '').toLowerCase() === 'true' || process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: SESSION_TIMEOUT_MS
  };
}

function setSessionCookie(res, sid) {
  res.cookie(SESSION_COOKIE_NAME, sid, cookieOptions());
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
}

function sessionExpiryDate() {
  return new Date(Date.now() + SESSION_TIMEOUT_MS);
}

module.exports = {
  SESSION_COOKIE_NAME,
  SESSION_TIMEOUT_MINUTES,
  SESSION_TIMEOUT_MS,
  newSessionId,
  getSidFromRequest,
  cookieOptions,
  setSessionCookie,
  clearSessionCookie,
  sessionExpiryDate
};
