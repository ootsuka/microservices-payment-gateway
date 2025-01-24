// middleware/errorHandler.js
const { AppError } = require('../utils/customError')

const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        // Operational errors (like validation, not found, etc.)
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    // Unexpected or programmer errors
    console.error('Unexpected error:', err);
    return res.status(500).json({
        status: 'error',
        message: err.message
    });
};

module.exports = errorHandler;
