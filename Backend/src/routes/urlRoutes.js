
const express = require("express");
const router = express.Router();
const Url = require("../models/url_model");
const { nanoid } = require("nanoid");

// POST /api/shorten
router.post("/shorten", async (req, res) => {

  try {
    console.log("BODY:", req.body);
    const { originalUrl } = req.body;

    // 1. Validate input
    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required" });
    }

    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // 2. Check duplicate
    const existing = await Url.findOne({ originalUrl });
    if (existing) {
      return res.json({
        shortUrl: `${req.protocol}://${req.get("host")}/${existing.shortCode}`,
      });
    }

    // 3. Generate short code
    const shortCode = nanoid(6);

    // 4. Save
    const newUrl = new Url({
      originalUrl,
      shortCode,
    });

    await newUrl.save();

    // 5. Response
    res.json({
      shortUrl: `${req.protocol}://${req.get("host")}/${shortCode}`,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
   
});

// Get /:shortCode
router.get("/:shortCode" , async(req , res) => {
    try{
        const { shortCode } = req.params;

        // 1. Find in Db
        const url = await Url.findOne({ shortCode });

        // 2. If not found
        if(!url){
            return res.status(404).json({error : "Url not found"});
        }
        // 3. Redirect
        return res.redirect(url.originalUrl);


    }
    catch(err){
        console.log(err);
        return res.status(500).json({error : "Server error"});
    }
})



module.exports = router;

