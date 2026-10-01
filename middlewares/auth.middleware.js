const jwt = require('jsonwebtoken');
const config = require('../configs');

/** Requires `Authorization: Bearer <token>`; sets req.user = { id, email, role } */
const authenticate = async (req, res, next) => {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, message: 'Missing or malformed Authorization header' });
    }
    const payload = jwt.verify(token, config.jwt.secret);

    // Lazy require avoids load-order coupling; also confirms the user still exists and is active.
    const { user: userService } = require('../services');
    const user = await userService.findById(payload.sub);
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'User no longer valid' });
    }
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    next(err);
  }
};

/** Usage: router.delete('/:id', authenticate, authorize('admin'), ...) */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  next();
};

module.exports = { authenticate, authorize };
