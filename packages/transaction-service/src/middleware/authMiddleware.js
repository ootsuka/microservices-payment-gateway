const { validateToken } = require('../utils/jwt');


const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Token is required for authentication' });
    }

    try {
        const decoded = validateToken(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user data to the request object
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
