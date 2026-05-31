const Joi = require("joi");

const createShortUrlSchema = Joi.object({
  originalUrl: Joi.string()
    .uri()
    .required()
    .messages({
      "string.base": "URL must be a string",
      "string.empty": "URL is required",
      "string.uri": "Invalid URL format",
      "any.required": "URL is required",
    }),

  customAlias: Joi.string()
    .alphanum()
    .min(3)
    .max(20)
    .optional()
    .messages({
      "string.base": "Custom alias must be a string",
      "string.min": "Alias must be at least 3 characters",
      "string.max": "Alias can not exceed 20 characters",
      "string.alphanum": "Alias must contain only letters and numbers",
    }),

  expiresAt: Joi.date()
    .iso()
    .greater("now")
    .optional()
    .allow(null)
    .messages({
      "date.format": "expiresAt must be a valid ISO date",
      "date.greater": "Expiration date must be in the future",
    }),
});

module.exports = {
  createShortUrlSchema,
};
