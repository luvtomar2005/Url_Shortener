const express = require("express");

const router = express.Router();

const {
  getAnalytics,
} = require("../controllers/analytics_controller");

const validateAnalyticsQuery = require(
  "../middlewares/validateAnalyticsquery"
);

router.get(
  "/:shortCode",
  validateAnalyticsQuery,
  getAnalytics
);

module.exports = router;