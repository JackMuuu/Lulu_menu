const crypto = require('crypto');

const KEY_LEN = 64;
const DIGEST = 'sha256';

function toBuffer(hexOrBuffer) {
  return Buffer.isBuffer(hexOrBuffer) ? hexOrBuffer : Buffer.from(hexOrBuffer, 'hex');
}

async function hashPassword(password) {
  if (typeof password !== 'string' || password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LEN, { cost: 16384, blockSize: 8, parallelization: 1 }, (err, key) => {
      if (err) return reject(err);
      resolve(key);
    });
  });

  return `scrypt$${salt}$${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string' || !storedHash.startsWith('scrypt$')) {
    return false;
  }

  const parts = storedHash.split('$');
  if (parts.length !== 3) return false;

  const [, salt, hashHex] = parts;
  const expected = Buffer.from(hashHex, 'hex');

  const derivedKey = await new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, expected.length, { cost: 16384, blockSize: 8, parallelization: 1 }, (err, key) => {
      if (err) return reject(err);
      resolve(key);
    });
  });

  if (derivedKey.length !== expected.length) return false;
  return crypto.timingSafeEqual(derivedKey, expected);
}

module.exports = { hashPassword, verifyPassword };
