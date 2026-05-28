const Url = require("../models/url_model");

const {
    redisClient
} = require("../config/redis");

const resolveRedirectService =
async (shortCode) => {

    console.log(
        "REDIRECT SERVICE EXECUTED"
    );

    let cachedUrl = null;

    try {

        cachedUrl =
            await redisClient.get(shortCode);

    } catch (error) {

        console.error(
            "REDIS GET FAILED:",
            error.message
        );
    }

    if (cachedUrl) {

        try {

            const parsedData =
                JSON.parse(cachedUrl);

            console.log("CACHE HIT");

            return parsedData;

        } catch (error) {

            console.error(
                "CACHE PARSE FAILED:",
                error.message
            );
        }
    }

    console.log("CACHE MISS");

    const url = await Url.findOne({
        shortCode,
        status: "active"
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

    try {

        await redisClient.set(
            shortCode,
            JSON.stringify({
                originalUrl:
                    url.originalUrl
            }),
            {
                EX: 3600
            }
        );

        console.log(
            "REDIS CACHE STORED"
        );

    } catch (error) {

        console.error(
            "REDIS SET FAILED:",
            error.message
        );
    }

    return {
        originalUrl:
            url.originalUrl
    };
};

module.exports = {
    resolveRedirectService
};