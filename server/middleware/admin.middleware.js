/**
 * Admin role check middleware — must be used after protect()
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  const error = new Error('Access denied. Admin privileges required');
  error.statusCode = 403;
  next(error);
};

module.exports = { adminOnly };
