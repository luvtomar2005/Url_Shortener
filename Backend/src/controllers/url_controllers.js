const {
  createShortUrlService,
  getOriginalUrlService
} = require("../service/url_service");

const AppError = require("../utils/AppError");

const catchAsync = require(
  "../utils/catchAsync"
);

/* create short url */
exports.createShortUrl = catchAsync(
  async (req, res, next) => {

    const {
      originalUrl,
      customAlias
    } = req.body;

    const newUrl =
      await createShortUrlService({
        originalUrl,
        customAlias
      });

    return res.status(201).json({
      success: true,

      shortUrl:
        `http://localhost:3000/${newUrl.shortCode}`
    });
  }
);

/* redirect controller */
exports.redirectToUrl = catchAsync(
  async (req, res, next) => {

    const { shortCode } = req.params;

    const url =
      await getOriginalUrlService(shortCode);

    if (!url) {

      return next(
        new AppError(
          "Short URL not found",
          404
        )
      );
    }

    return res.redirect(url.originalUrl);
  }
);