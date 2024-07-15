const crypto = require('crypto');

function base64UrlEncode(data) {
  return Buffer.from(data)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(base64UrlStr) {
  base64UrlStr = base64UrlStr.replace(/-/g, '+').replace(/_/g, '/');
  let padding = '';
  if (base64UrlStr.length % 4 === 2) {
    padding = '==';
  } else if (base64UrlStr.length % 4 === 3) {
    padding = '=';
  }
  return Buffer.from(base64UrlStr + padding, 'base64').toString();
}

function signJwt(payload, secret, exp) {

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  payload.iat = Math.floor(Date.now()/1000);
  payload.exp = Math.floor(Date.now()/1000) + exp;
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const jwt = `${encodedHeader}.${encodedPayload}.${signature}`;
  return jwt;
}

function verifyJwt(token, secret) {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

    const payload = JSON.parse(base64UrlDecode(encodedPayload));


    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, reason: 'Token has expired' };
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (expectedSignature !== encodedSignature) {
      return { valid: false, reason: 'Invalid signature' };
    }

    return { valid: true, payload: payload };
  } catch (e) {
    return { valid: false, reason: e.message };
  }
}

exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;