const {
  createShortUrlService,
  getRecentUrlsService,
  buildShortUrl,
} = require("../service/url_service");

const formatUrlResponse = (urlDoc) => ({
  _id: urlDoc._id,
  originalUrl: urlDoc.originalUrl,
  shortCode: urlDoc.shortCode,
  shortUrl: buildShortUrl(urlDoc.shortCode),
  status: urlDoc.status,
  expiresAt: urlDoc.expiresAt ?? null,
  createdAt: urlDoc.createdAt,
});

const createShortUrl = async (req, res) => {
  const { originalUrl, customAlias, expiresAt } = req.body;

  const newUrl = await createShortUrlService({
    originalUrl,
    customAlias,
    expiresAt,
  });

  return res.status(201).json({
    success: true,
    message: "Short URL created successfully",
    data: formatUrlResponse(newUrl),
  });
};

const getRecentUrls = async (req, res) => {
  const urls = await getRecentUrlsService(20);

  return res.status(200).json({
    success: true,
    data: urls,
  });
};

module.exports = {
  createShortUrl,
  getRecentUrls,
};
