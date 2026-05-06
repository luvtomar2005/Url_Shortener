const Url = require("../models/url_model");
const { nanoid } = require("nanoid");

exports.createShortUrlService = async(originalUrl) => {

    let shortCode;
    let existingUrl;

    do {

        shortCode = nanoid(7);

        existingUrl = await Url.findOne({ shortCode });

    } while(existingUrl);

    const newUrl = await Url.create({
        originalUrl,
        shortCode
    });

    return newUrl;
};

exports.getOriginalUrlService = async(shortCode) => {

    const url = await Url.findOne({ shortCode });

    return url;
};