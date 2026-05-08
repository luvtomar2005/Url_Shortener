const express = require("express");
const router = express.Router();

const { redirectToOriginalUrl } = require("../controllers/url_controllers");

router.get("/:shortCode", redirectToOriginalUrl);

module.exports = router;