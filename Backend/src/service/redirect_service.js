const AppError = require("../utils/AppError");
const Url = require("../models/url_model");
const cache_service = require("./cache_service");
const resolvedRedirectService = async(shortCode) => {
    console.log("Redirect Service executed");

    const cachedUrl = await cache_service(shortCode);

    if(cachedUrl){
        console.log("Cache Hit");
        return cachedUrl;
    }
    console.log("Cache Miss");

    const url = await Url.findOne({
        shortCode,
        status : "active"
    }).lean();

    if(!url){
        throw new AppError(
            "Short Url Not Found",
            404
        )
    }
    if(url.expiresAt && new Date(url.expiresAt).getTime() <= Date.now()){
        return null;
    }
    await cacheService.set(
        shortCode,
        {
            originalUrl : url.originalUrl
        }
    );
    return {
        originalUrl : url.originalUrl
    }
}


module.exports = { resolvedRedirectService}
