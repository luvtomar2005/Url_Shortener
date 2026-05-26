const express = require("express");
const helmet = require("helmet");

const hpp = require("hpp");
const analyticsRoutes = require("./routes/analytics_routes");
const AppError = require("./utils/AppError");
const requestId = require("./middlewares/requestId");
const requestLogger = require("./middlewares/requestLogger");
const apiLimiter = require("./middlewares/rateLimiter");

function createApp() {
  const app = express();

  /* 1. SECURITY HEADERS — always first */
  app.use(helmet());

  /* 2. BODY PARSING */
  app.use(express.json({ limit: "10kb" }));

  // removed sanitization for sometime because the app was not working in production
  app.use(hpp());

  /* 4. REQUEST TRACKING */
  app.use(requestId);
  app.use(requestLogger);

  /* 5. HEALTH CHECK — before rate limiter */
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
    });
  });

  /* 6. RATE LIMITING — after health check */
  app.use("/api", apiLimiter);

  /* 7. ROUTES — specific before generic */
  const apiRoutes = require("./routes/urlRoutes");
  const redirectRoutes = require("./routes/url_redirectRoutes");

  app.use("/api/analytics", analyticsRoutes);
  app.use("/api", apiRoutes);
  app.use("/", redirectRoutes);

  /* 8. UNKNOWN ROUTES */
  app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
  });

  /* 9. GLOBAL ERROR HANDLER — always last */
  const errorMiddleware = require("./middlewares/error_middleware");
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
