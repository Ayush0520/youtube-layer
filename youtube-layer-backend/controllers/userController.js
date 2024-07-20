const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const updateUserProfile = asyncHandler(async (req, res) => {
    const { username } = req.user; // Assume username is extracted from JWT token
    const { firstName, lastName, email, mobileNo } = req.body;

    const user = await User.findByUsername(username);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.mobileNo = mobileNo || user.mobileNo;

    await User.update(user);

    res.status(200).json({ message: 'User profile updated successfully' });
});

module.exports = {
    updateUserProfile
};
