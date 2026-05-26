const logger = require("../config/logger");

const errorMiddleware = (
    err,
    req,
    res,
    next
) => {

    err.statusCode = err.statusCode || 500;

    err.status = err.status || "error";

    logger.error({

        requestId: req.requestId,

        message: err.message,

        stack: err.stack,

        statusCode: err.statusCode,

        method: req.method,

        url: req.originalUrl
    });

    res.status(err.statusCode).json({

        success: false,

        status: err.status,

        message: err.isOperational
            ? err.message
            : "Something went wrong"
    });
};

module.exports = errorMiddleware;