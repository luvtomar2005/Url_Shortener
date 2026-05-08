const Url = require("../models/url_model");

const {
  createShortUrlService,
  getOriginalUrlService
} = require("../service/url_service");

const { trackAnalytics } = require("../service/analytics_service");


// CREATE SHORT URL
const createShortUrl = async (req, res) => {

  const { originalUrl, customAlias } = req.body;

  const newUrl = await createShortUrlService({
    originalUrl,
    customAlias
  });

  return res.status(201).json({
    success: true,
    shortCode: newUrl.shortCode,
    shortUrl: `http://localhost:3000/${newUrl.shortCode}`,
  });
};


// REDIRECT
const redirectToOriginalUrl = async (req, res) => {

  try {

    const { shortCode } = req.params;

    const url = await Url.findOne({ shortCode });

    if (!url) {
      return res.status(404).json({
        success: false,
        message: "Short Url not found",
      });
    }

    const ipAddress = req.ip;
    const userAgent = req.get("User-Agent");
    const referrer =
      req.get("Referrer") ||
      req.get("Referer");

    await trackAnalytics({
      urlId: url._id,
      ipAddress,
      userAgent,
      referrer,
    });

    return res.redirect(url.originalUrl);

  } catch (err) {

    console.log(
      "Redirect failed",
      err.message
    );

    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};


module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
};