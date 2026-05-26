const logger = require("../config/logger");

const requestLogger = (req, res, next) => {

  console.log("LOGGER MIDDLEWARE HIT");

  const start = Date.now();

  res.on("finish", () => {

    try {

      const duration = Date.now() - start;

      logger.info({
        requestId: req.id,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip
      });

    } catch (error) {

      console.log("LOGGER ERROR:");
      console.log(error);

    }

  });

  next();
};

module.exports = requestLogger;