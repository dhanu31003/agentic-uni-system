// api-gateway/middlewares/auth.js
const jwt = require('jsonwebtoken');

// Verify JWT and attach user payload to req.user
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId, role, iat, exp }
    next();
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Role-based access: only allow if req.user.role is in allowed roles
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient rights' });
    }
    next();
  };
};

module.exports = { verifyToken, authorizeRoles };
