const logger = require("../config/logger");

const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const status = err.status || "error";

  try {
    logger.error({
      requestId: req.requestId,

      message: err.message,

      stack: err.stack,

      statusCode,

      method: req.method,

      url: req.originalUrl,
    });
  } catch (loggingError) {
    console.error("LOGGER FAILURE:", loggingError.message);
  }

  const response = {
    success: false,

    status,

    message: err.isOperational ? err.message : "Something went wrong",
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
