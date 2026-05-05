
const express = require("express");
const router = express.Router();


const {createShortUrl } = require("../controllers/url_controllers");

router.post("/shorten" , createShortUrl);
module.exports = router;

