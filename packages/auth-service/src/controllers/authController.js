const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const { generateToken } = require('../utils/jwtUtils');

const register = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
    } catch (error) {
        next(error)
    }
};

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.log(error)
        next(error)
    }
};

module.exports = { register, login };
