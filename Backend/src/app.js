const express = require("express");

function createApp(){
  const app = express();
  /* middlewares */
  app.use(express.json());

  /* routes */
  const apiRoutes = require("./routes/urlRoutes");

  const redirectRoutes = require("./routes/url_redirectRoutes");

  app.use("/api" , apiRoutes);

  app.use("/" , redirectRoutes);

  /* health check */

  app.get("/health" , (req , res) => {
    res.json({
      status : "OK"
    })
  })
  

  /* global error middleware */

  const errorMiddleware = require("./middlewares/error_middleware");
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };

