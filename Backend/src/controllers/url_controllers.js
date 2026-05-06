const {
    createShortUrlService,
    getOriginalService,
    getOriginalUrlService
} = require("../service/url_service");


const asyncHandler = require("../middlewares/async_handler");
exports.createShortUrl = asyncHandler(async(req , res) => {
    const { originalUrl } = req.body;
    if(!originalUrl){
        return res.status(400).json({
            message : "URL is required"
        });
    }
    const newUrl = await createShortUrlService(originalUrl);

    return res.status(201).json({
        shortUrl : `http://localhost:3000/${newUrl.shortCode}`
    });
});

/* redirect controller */
exports.redirectToUrl = asyncHandler(async(req , res) => {
    const { shortCode } = req.params;

    if(!shortCode){
        return res.status(400).json({
            message : "Short Code is required"
        });
    }
    const url = await getOriginalUrlService(shortCode);
    if(!url){
        return res.status(404).json({
            message : "URL not found"
        });
    }   
    return res.redirect(url.originalUrl);
})
