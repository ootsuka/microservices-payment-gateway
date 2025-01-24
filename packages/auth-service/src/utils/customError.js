// utils/customErrors.js
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Flag to mark operational errors
        Error.captureStackTrace(this, this.constructor); // For proper stack trace
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 400);
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404);
    }
}

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message, 401);
    }
}

// Add more error classes as needed
module.exports = { AppError, ValidationError, NotFoundError, UnauthorizedError };
