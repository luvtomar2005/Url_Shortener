const Analytics = require("../models/analytics_model");
const ShortUrl = require("../models/url_model");


// TRACK ANALYTICS
const trackAnalytics = async ({
  urlId,
  ipAddress,
  userAgent,
  referrer,
}) => {

  await Analytics.create({
    shortUrl: urlId,
    ipAddress,
    userAgent,
    referrer,
  });
};


// GET ANALYTICS
const getAnalyticsService = async ({
  shortCode,
  page,
  limit,
}) => {

  const shortUrl = await ShortUrl.findOne({
    shortCode,
  }).lean();

  if (!shortUrl) {
    throw new Error("Short URL not found");
  }

  const skip = (page - 1) * limit;

  const analytics = await Analytics.find({
    shortUrl: shortUrl._id,
  })
    .select(
      "ipAddress userAgent referrer createdAt"
    )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Analytics.countDocuments({
    shortUrl: shortUrl._id,
  });

  return {
    analytics,

    pagination: {
      total,
      page,
      limit,

      totalPages: Math.ceil(total / limit),

      hasNextPage:
        page < Math.ceil(total / limit),

      hasPrevPage: page > 1,
    },
  };
};


module.exports = {
  trackAnalytics,
  getAnalyticsService,
};