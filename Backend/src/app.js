const dns = require("node:dns");
dns.setServers(["1.1.1.1", "1.0.0.1"]);

function createApp(){
  const express = require("express");
  const app = express();

  const urlRoutes = require("./routes/urlRoutes");

  // Middleware 
  app.use(express.json());
  
  // Routes
  const apiRoutes = require("./routes/urlRoutes");
  const redirectRoutes = require("./routes/url_redirectRoutes");
  app.use("/api" , apiRoutes); // for post
  app.use("/" , redirectRoutes); // for get redirect
  

//   // Health check
  app.get("/health" , (req, res) => {
    res.json({status: "OK"});
  })
  return app;
}

module.exports = { createApp };