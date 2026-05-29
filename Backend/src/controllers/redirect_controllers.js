const AppError = require("../utils/AppError");

const { resolveRedirectService } = require("../service/redirect_service");

const { trackAnalytics } = require("../service/analytics_service");

const { resolvedRedirectService } = require("../service/redirect_service");

const redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    if (!shortCode || !/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
      return next(new AppError("Invalid short code", 400));
    }

    const url = await resolveRedirectService(shortCode);

    if (!url) {
      return next(new AppError("Short URL not found", 404));
    }

    const ipAddress = req.ip;

    const userAgent = req.get("User-Agent");

    const referrer = req.get("Referrer") || req.get("Referer");

    await trackAnalytics({
      urlId: url._id,
      ipAddress,
      userAgent,
      referrer,
    });

    return res.redirect(url.originalUrl);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  redirectToOriginalUrl,
};
