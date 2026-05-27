const Url = require("../models/url_model");

const {
    redisClient
} = require("../config/redis");

const resolveRedirectService =
async (shortCode) => {

    console.log(
        "REDIRECT SERVICE EXECUTED"
    );

    const cachedUrl =
        await redisClient.get(shortCode);

    if (cachedUrl) {

        console.log("CACHE HIT");

        return JSON.parse(cachedUrl);
    }

    console.log("CACHE MISS");

    const url = await Url.findOne({
        shortCode,
        
    }).lean();

    if (!url) {
        return null;
    }

    if (
        url.expiresAt &&
        new Date(url.expiresAt)
            .getTime() <= Date.now()
    ) {
        return null;
    }

    await redisClient.set(
        shortCode,
        JSON.stringify(url),
        {
            EX: 3600
        }
    );

    console.log(
        "REDIS CACHE STORED"
    );

    return url;
};

module.exports = {
    resolveRedirectService
};