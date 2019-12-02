import jwt from 'jsonwebtoken';

import config from '../config';

export const checkToken = async (req, res, next) => {
  const JWT_SECRET = config.JWT_SECRET || 'minimalpm@secretl0ngtext';
  let token = req.headers['x-access-token'] || req.headers['authorization'] || '';
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        req.token = token;
        next();
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};