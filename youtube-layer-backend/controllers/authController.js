const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');

const register = asyncHandler(async (req, res) => {
    const { userType, firstName, lastName, email, password, mobileNo } = req.body;
    
    // Determine the prefix based on userType
    let prefix;
    if (userType === 'youtuber') {
        prefix = 'y-';
    } else if (userType === 'editor') {
        prefix = 'e-';
    } else {
        res.status(400);
        throw new Error('Invalid user type');
    }

    // Check if the email or mobile number is already taken
    const existingEmailUser = await User.findByEmail(email);
    const existingMobileUser = await User.findByMobileNo(mobileNo);

    if (existingEmailUser) {
        res.status(400);
        throw new Error('Email already taken');
    }

    if (existingMobileUser) {
        res.status(400);
        throw new Error('Mobile number already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const tempUsername = uuidv4();  // Generate a temporary unique username
    const user = new User(null, tempUsername, firstName, lastName, email, hashedPassword, mobileNo, userType);
    const createdUser = await User.create(user);
    
    if (!createdUser) {
        res.status(500);
        throw new Error('User creation failed');
    }

    // Generate the unique username using the prefix and user ID
    const username = `${prefix}${createdUser.id}`;

    // Update the user record with the generated username
    await User.updateUsername(createdUser.id, username);

    res.status(201).json({ message: 'User registered successfully', username });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(400);
        throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: user.username }, process.env.JWT_SECRET, { expiresIn: '2h' });
    if(!token) {
        res.status(500);
        throw new Error('Failed to generate token');
    }
    res.json({ token });
});

module.exports = {
    register,
    login
};
