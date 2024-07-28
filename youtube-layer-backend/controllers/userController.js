const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// Get User Profile
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByUsername(req.user.id); // req.user.id will be set by the JWT middleware

    if (user) {
        res.json({
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            mobileNo: user.mobile_no
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// Update User Profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findByUsername(req.user.id); // req.user.id will be set by the JWT middleware
    
    if (user) {
        user.first_name = req.body.firstName || user.first_name;
        user.last_name = req.body.lastName || user.last_name;
        user.email = req.body.email || user.email;
        user.mobile_no = req.body.mobileNo || user.mobile_no;

        const updatedUser = await User.update(user);

        res.json({
            username: updatedUser.username,
            firstName: updatedUser.first_name,
            lastName: updatedUser.last_name,
            email: updatedUser.email,
            mobileNo: updatedUser.mobile_no
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

module.exports = {
    getUserProfile,
    updateUserProfile
};