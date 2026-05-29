const express = require("express");

const helmet = require("helmet");

const hpp = require("hpp");

const analyticsRoutes = require("./routes/analytics_routes");

const apiRoutes = require("./routes/urlRoutes");

const redirectRoutes = require("./routes/url_redirectRoutes");

const AppError = require("./utils/AppError");

const requestId = require("./middlewares/requestId");

const requestLogger = require("./middlewares/requestLogger");

const apiLimiter = require("./middlewares/rateLimiter");

const errorMiddleware = require("./middlewares/error_middleware");

function createApp() {
  const app = express();

  /*
    ==============================
    1. SECURITY MIDDLEWARES
    ==============================
    */

  app.use(helmet());

  app.use(hpp());

  /*
    ==============================
    2. BODY PARSING
    ==============================
    */

  app.use(
    express.json({
      limit: "10kb",
    }),
  );

  /*
    ==============================
    3. REQUEST TRACING + LOGGING
    ==============================
    */

  app.use(requestId);

  app.use(requestLogger);

  /*
    ==============================
    4. HEALTH CHECK ROUTE
    ==============================
    */

  app.get("/health", (req, res) => {
    return res.status(200).json({
      success: true,

      message: "Server is running",
    });
  });

  /*
    ==============================
    5. RATE LIMITER
    ==============================
    */

  app.use("/api", apiLimiter);

  /*
    ==============================
    6. API ROUTES
    ==============================
    */

  app.use("/api", apiRoutes);

  app.use("/api/analytics", analyticsRoutes);

  /*
    ==============================
    7. REDIRECT ROUTES
    ==============================
    */

  app.use("/", redirectRoutes);

  /*
    ==============================
    8. UNKNOWN ROUTES
    ==============================
    */

  app.use((req, res, next) => {
    next(
      new AppError(
        `Route ${req.originalUrl} not found`,

        404,
      ),
    );
  });

  /*
    ==============================
    9. GLOBAL ERROR MIDDLEWARE
    ==============================
    */

  app.use(errorMiddleware);

  return app;
}

module.exports = {
  createApp,
};
