const {
  getAnalyticsService,
} = require("../service/analytics_service");

const getAnalytics = async (req, res) => {

  try {

    const { shortCode } = req.params;

    const { page, limit } = req.pagination;

    const result = await getAnalyticsService({
      shortCode,
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};