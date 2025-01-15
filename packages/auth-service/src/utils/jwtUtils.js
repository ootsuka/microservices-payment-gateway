const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
        expiresIn: '2h',
    });
};

module.exports = { generateToken };
