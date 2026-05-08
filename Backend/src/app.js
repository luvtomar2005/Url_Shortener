const express = require("express");

const analyticsRoutes = require("./routes/analytics_routes");

const AppError = require("./utils/AppError");

function createApp() {

  const app = express();

  /* middlewares */
  app.use(express.json());

  /* routes */
  const apiRoutes = require("./routes/urlRoutes");

  const redirectRoutes = require("./routes/url_redirectRoutes");

  app.use("/api", apiRoutes);

  app.use("/api/analytics", analyticsRoutes);

  app.use("/", redirectRoutes);

  /* health check */
  app.get("/health", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Server is running"
    });
  });

  /* unknown routes */
  app.use((req, res, next) => {

    next(
      new AppError(
        `Route ${req.originalUrl} not found`,
        404
      )
    );

  });

  /* global error middleware */
  const errorMiddleware =
    require("./middlewares/error_middleware");

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };