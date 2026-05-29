const logger = require("../config/logger");

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  logger.info({
    requestId: req.requestId,

    method: req.method,

    url: req.originalUrl,

    message: "Incoming request",
  });

  res.on("finish", () => {
    const duration = Date.now() - startTime;

    logger.info({
      requestId: req.requestId,

      method: req.method,

      url: req.originalUrl,

      statusCode: res.statusCode,

      duration: `${duration}ms`,

      message: "Request completed",
    });
  });

  next();
};

module.exports = requestLogger;
