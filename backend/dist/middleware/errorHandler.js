"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Server error:', err);
    const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        code: err.code || 'INTERNAL_ERROR',
        ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
    });
};
exports.errorHandler = errorHandler;
