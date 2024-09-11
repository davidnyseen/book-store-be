import jwt from 'jsonwebtoken';
import { AppError } from '../errors';

export function createToken(payload, key, exp) {
  const keyEncoded = Buffer.from(key, 'base64').toString('utf-8');
  return jwt.sign(payload, keyEncoded, {
    algorithm: 'RS256',
    expiresIn: exp,
  });
}

export function verifyToken(token, key) {
  try {
    const keyEncoded = Buffer.from(key, 'base64').toString('utf-8');
    return jwt.verify(token, keyEncoded, {
      ignoreExpiration: false,
      algorithms: ['RS256'],
    });
  } catch (err) {
    throw AppError.invalid('Token is not valid.');
  }
}
