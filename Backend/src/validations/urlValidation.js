// const Joi = require("joi");
const Joi = require("joi");
const createShortUrlSchema = Joi.object({
    originalUrl : Joi.string()
    .uri()
    .required()
    .messages({
        "string base" : "URL must be a string",
        "string.empty" : "URL is required",
        "String.uri": "Please provide a valid URL",
        "any.required" : "URL is required"
    }),

    customAlias : Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .optional()
    .messages({
        "string.base" : "Custom alias must be a string",
        "string.min" : "Alias must be at least 3 characters",
        "string.max" : "Alias can not exceed 20 characters",
        "string.alphanum" : "Alias must contain only letters and numbers"
    })
});

module.exports = {
    createShortUrlSchema
};


