const Url = require("../models/url_model");

const AppError = require("../utils/AppError");

const cacheService = require("./cache_service");

const resolveRedirectService = async (shortCode) => {
  console.log("REDIRECT SERVICE EXECUTED");

  const cachedUrl = await cacheService.get(shortCode);

  if (cachedUrl) {
    console.log("CACHE HIT");

    return cachedUrl;
  }

  console.log("CACHE MISS");

  const url = await Url.findOne({
    shortCode,

    status: "active",
  }).lean();

  if (!url) {
    throw new AppError(
      "Short URL not found",

      404,
    );
  }

  if (url.expiresAt && new Date(url.expiresAt).getTime() <= Date.now()) {
    throw new AppError(
      "Short URL expired",

      410,
    );
  }

  await cacheService.set(
    shortCode,

    {
      _id: url._id,

      originalUrl: url.originalUrl,
    },
  );

  return {
    _id: url._id,

    originalUrl: url.originalUrl,
  };
};

module.exports = {
  resolveRedirectService,
};
