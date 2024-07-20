const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const register = asyncHandler(async (req, res) => {
    const { username, firstName, lastName, email, password, mobileNo } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User(username, firstName, lastName, email, hashedPassword, mobileNo);
    await User.create(user);
    res.status(201).json({ message: 'User registered successfully' });
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
    const token = jwt.sign({ id: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = {
    register,
    login
};
