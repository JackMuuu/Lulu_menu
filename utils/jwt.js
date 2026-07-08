const crypto = require('crypto');

function createSessionToken() {
  return crypto.randomBytes(48).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex');
}

module.exports = {
  createSessionToken,
  hashToken,
};