const express = require("express");

const router = express.Router();

const urlController = require("../controllers/url_controllers");

const validate = require("../middlewares/validate");

const asyncHandler = require("../middlewares/async_handler");

const { createShortUrlSchema } = require("../validations/urlValidation");

router.post(
  "/url/shorten",
  validate(createShortUrlSchema),
  asyncHandler(urlController.createShortUrl),
);

router.get("/url/recent", asyncHandler(urlController.getRecentUrls));

module.exports = router;
