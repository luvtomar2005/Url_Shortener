const dns = require("node:dns").promises; 
dns.setServers(["1.1.1.1", "1.0.0.1"]);   



function createApp() {
  const express = require("express");
  const app = express();

  app.get("/health", (req, res) => {
    res.json({ status: "OK" });
  });

  return app;
}

module.exports = { createApp };