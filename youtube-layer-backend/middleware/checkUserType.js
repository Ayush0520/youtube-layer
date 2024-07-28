const asyncHandler = require('express-async-handler');
const User = require('../models/user');

const checkUserType = (requiredType) => {
    return asyncHandler(async (req, res, next) => {
      const user = await User.findByUsername(req.user.id);

      if (user.user_type !== requiredType) {
        res.status(403);
        throw new Error(`Access denied: Only ${requiredType}s can perform this action`);
      }
  
      next();
    });
  };

module.exports = checkUserType;
