const Url = require("../models/url_model");

const { createShortUrlService } = require("../service/url_service");

const { trackAnalytics } = require("../service/analytics_service");

const AppError = require("../utils/AppError");

const createShortUrl = async (req, res) => {
  console.log("CONTROLLER START");

  const { originalUrl, customAlias } = req.body;

  console.log("BEFORE SERVICE");

  const newUrl = await createShortUrlService({
    originalUrl,

    customAlias,
  });

  console.log("AFTER SERVICE");

  return res.status(201).json({
    success: true,

    shortCode: newUrl.shortCode,

    shortUrl: `http://localhost:3000/${newUrl.shortCode}`,
  });
};



module.exports = {

    createShortUrl,

    
};

