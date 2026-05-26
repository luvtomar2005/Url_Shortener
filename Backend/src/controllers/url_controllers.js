const Url = require("../models/url_model");

const {
    createShortUrlService
} = require("../service/url_service");

const {
    trackAnalytics
} = require("../service/analytics_service");

const AppError =
    require("../utils/AppError");

const createShortUrl =
    async (req, res) => {

        const {
            originalUrl,
            customAlias
        } = req.body;

        const newUrl =
            await createShortUrlService({

                originalUrl,

                customAlias
            });

        return res.status(201).json({

            success: true,

            shortCode:
                newUrl.shortCode,

            shortUrl:
                `http://localhost:3000/${newUrl.shortCode}`
        });
    };

const redirectToOriginalUrl =
    async (req, res, next) => {

        const { shortCode } =
            req.params;

        const url =
            await Url.findOne({
                shortCode
            });

        if (!url) {

            return next(

                new AppError(
                    "Short URL not found",
                    404
                )
            );
        }

        await trackAnalytics({

            urlId: url._id,

            ipAddress: req.ip,

            userAgent:
                req.get("User-Agent"),

            referrer:
                req.get("Referrer")
                || req.get("Referer")
        });

        return res.redirect(
            url.originalUrl
        );
    };

module.exports = {

    createShortUrl,

    redirectToOriginalUrl
};