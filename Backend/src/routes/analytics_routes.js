const express = require("express");

const router = express.Router();

const {
  getAnalyticsByShortCode,
} = require("../controllers/analytics_controller");

router.get("/:shortCode", getAnalyticsByShortCode);

module.exports = router;