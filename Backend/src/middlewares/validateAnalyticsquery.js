
const validateAnalyticsQuery = (req , res , next) => {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    // writing this for preventing negative or invalid page
    if(page < 1 || isNaN(page)){
        return res.status(400).json({
            success  : false,
            message : "Page must be a positive integer",
        });
    }
    // Prevent invalid limit
    if(limit < 1 || isNaN(limit)){
        return res.status(400).json({
            sucess : false,
            message : "Limit must be a positive integer",
        });
    }

    // Store valdiated values
    req.pagination = {
        page,
        limit,
    };

    next();
}

module.exports = validateAnalyticsQuery;
