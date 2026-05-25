const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;

    const message =
        err.statusCode
            ? err.message
            : "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        message,
    });
};

module.exports = errorMiddleware;

