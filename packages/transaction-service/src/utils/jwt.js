const jwt = require('jsonwebtoken');

module.exports.validateToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.log('err', err)
        throw new Error('Invalid token');
    }
};
