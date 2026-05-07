const express = require("express");

const router = express.Router();

const urlController = require("../controllers/url_controllers");

const catchAsync = require("../utils/catchAsync");

const validate = require("../middlewares/validate");

const {
  createShortUrlSchema
} = require("../validations/urlValidation");



router.post(
  "/shorten",

  validate(createShortUrlSchema),

  catchAsync(urlController.createShortUrl)
);

module.exports = router;