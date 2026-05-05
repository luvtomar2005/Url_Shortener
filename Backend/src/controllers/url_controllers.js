
const Url = require("../models/url_model");
const shortId = require("shortid");

exports.createShortUrl = async(req , res) => {
    try{
        const { originalUrl } = req.body;
        if(!originalUrl){
            return res.status(400).json({message : "URL is required"});
        }
        const shortCode = shortId.generate();

        const newUrl = new Url({
            originalUrl,
            shortCode
        });
        await newUrl.save();
        res.status(201).json({
            shortUrl : `http://localhost:3000/${shortCode}`
        });

    }
    catch(error){
        res.status(500).json({message : "Server Error"});
    }
}

/* function for redirecting the user */
exports.redirectToUrl = async(req , res, next) => {
    try{
        const shortCode = req.params.shortCode;
        // 1. Check if code exists
        if(!shortCode){
            return res.status(400).json({message : "Short Code is required"});
        }
        const url = await Url.findOne({ shortCode });

        if(!url){
            return res.status(404).json({message : "URL not found"});
        }
        // 4 -> redirect
        return res.redirect(url.originalUrl);
    }
    catch(error){
        next(error);
    }
}

