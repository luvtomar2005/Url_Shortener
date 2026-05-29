const express = require("express");

const router = express.Router();

const urlController = require("../controllers/url_controllers");

const validate = require("../middlewares/validate");

const asyncHandler = require("../middlewares/async_handler");

const { createShortUrlSchema } = require("../validations/urlValidation");

router.post(
  "/shorten",

  validate(createShortUrlSchema),

  asyncHandler(urlController.createShortUrl),
);

module.exports = router;
