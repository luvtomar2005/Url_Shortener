const Url = require("../models/url_model");

const { nanoid } = require("nanoid");

const RESERVED_ALIASES = require(
    "../constants/reservedAliases"
);

const validateCustomAlias = (alias) => {

    const aliasRegex = /^[a-z0-9-_]{3,20}$/;

    return aliasRegex.test(alias);
};

exports.createShortUrlService = async ({
    originalUrl,
    customAlias
}) => {

    let shortCode;

    if (customAlias) {

        const normalizedAlias = customAlias
            .trim()
            .toLowerCase();

        if (
            RESERVED_ALIASES.includes(
                normalizedAlias
            )
        ) {
            throw new Error(
                "Alias is reserved"
            );
        }

        const isValidAlias =
            validateCustomAlias(
                normalizedAlias
            );

        if (!isValidAlias) {
            throw new Error(
                "Invalid custom alias"
            );
        }

        shortCode = normalizedAlias;

    } else {

        let existingUrl;

        do {

            shortCode = nanoid(7);

            existingUrl =
                await Url.findOne({
                    shortCode
                });

        } while(existingUrl);
    }

    try {

        const newUrl = await Url.create({
            originalUrl,
            shortCode
        });

        return newUrl;

    } catch (error) {

        if (error.code === 11000) {

            throw new Error(
                "Custom alias already exists"
            );
        }

        throw error;
    }
};

exports.getOriginalUrlService = async (
    shortCode
) => {

    const url = await Url.findOne({
        shortCode
    });

    return url;
};