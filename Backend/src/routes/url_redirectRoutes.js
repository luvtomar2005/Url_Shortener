const express = require("express");
const router = express.Router();
const { redirectToUrl } = require("../controllers/url_controllers");
router.get("/:shortCode" , redirectToUrl);
module.exports = router;
