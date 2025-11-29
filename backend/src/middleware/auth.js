const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get teacher from token
      req.teacher = await Teacher.findById(decoded.id).select('-password');

      if (!req.teacher) {
        return res.status(401).json({
          success: false,
          message: 'Teacher not found',
        });
      }

      if (!req.teacher.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
      }

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token',
    });
  }
};

// Optional: Admin role check
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.teacher.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.teacher.role} is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
