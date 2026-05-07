const {
  createShortUrlService,
  getOriginalUrlService
} = require("../service/url_service");

const AppError = require("../utils/AppError");

/* create short url */
exports.createShortUrl = async (req, res, next) => {

  const {
    originalUrl
  } = req.body;

  const newUrl = await createShortUrlService(originalUrl);

  return res.status(201).json({
    success: true,
    shortUrl: `http://localhost:3000/${newUrl.shortCode}`
  });

};

/* redirect controller */
exports.redirectToUrl = async (req, res, next) => {

  const { shortCode } = req.params;

  const url = await getOriginalUrlService(shortCode);

  if (!url) {

    return next(
      new AppError(
        "Short URL not found",
        404
      )
    );

  }

  return res.redirect(url.originalUrl);

};