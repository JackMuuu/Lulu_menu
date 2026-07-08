function getInactivityMinutes() {
  const raw = process.env.SESSION_INACTIVITY_MINUTES || '30';
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 30;
}

function getSessionDurationMs() {
  return getInactivityMinutes() * 60 * 1000;
}

module.exports = {
  getInactivityMinutes,
  getSessionDurationMs,
};