const AppError = require("../utils/AppError");

const validate = (schema) => {

    return (req, res, next) => {

        const { error } = schema.validate(req.body, {

            abortEarly: false
        });

        if (error) {

            const errorMessages = error.details.map(

                (err) => err.message
            );

            return next(

                new AppError(
                    errorMessages.join(", "),
                    400
                )
            );
        }

        next();
    };
};

module.exports = validate;