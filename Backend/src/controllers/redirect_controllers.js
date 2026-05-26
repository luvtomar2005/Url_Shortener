const AppError = require("../utils/AppError");
const { resolveRedirectService } = require("../service/redirect_service");
const { trackAnalytics } = require("../service/analytics_service");

const redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // basic shortCode validation
    if (!shortCode || !/^[a-zA-Z0-9_-]+$/.test(shortCode)) {
      return next(new AppError("Invalid short code", 400));
    }

    // resolve redirect using service layer
    const url = await resolveRedirectService(shortCode);

    // not found / expired / inactive
    if (!url) {
      return next(new AppError("Short URL not found", 404));
    }

    // analytics tracking
    const ipAddress = req.ip;
    const userAgent = req.get("User-Agent");
    const referrer = req.get("Referrer") || req.get("Referer"); // ← fixed typo

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

module.exports = { redirectToOriginalUrl };