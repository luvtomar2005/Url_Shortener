
const url = require("../models/url_model");
const resolveRedirectService = async (shortCode) => {
    const url = await Url.findOne({
        shortCode,
        status : "active"
    }).lean();

    if(!url){
        return null;
    }
    // expiration check
    if(
        url.expiresAt && new Date(url.expiresAt).getTime() <= Date.now()
    ){
        return null;
    }
    return url;
}

module.exports = { resolveRedirectService }

