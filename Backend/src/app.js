const express = require("express");
const analyticsRoutes = require("./routes/analytics_routes");
const AppError = require("./utils/AppError");
const requestId = require("./middlewares/requestId");
const requestLogger = require("./middlewares/requestLogger");

function createApp() {
  const app = express();

  /* middlewares — ORDER MATTERS */
  app.use(express.json());
  app.use(requestId);        // ← assigns req.id to every request
  app.use(requestLogger);    // ← logs every request AFTER id is set

  /* health check — move ABOVE routes */
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running"
    });
  });

  /* routes */
  const apiRoutes = require("./routes/urlRoutes");
  const redirectRoutes = require("./routes/url_redirectRoutes");

  app.use("/api/analytics", analyticsRoutes);  // ← specific first
  app.use("/api", apiRoutes);                  // ← generic second
  app.use("/", redirectRoutes);

  /* unknown routes */
  app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
  });

  /* global error middleware */
  const errorMiddleware = require("./middlewares/error_middleware");
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };