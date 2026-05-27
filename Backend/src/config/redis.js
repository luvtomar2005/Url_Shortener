const redis = require("redis");

const redisClient = redis.createClient({
    url : process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error" , (err) => {
    console.log("Redis Error:" , err);
})

const connectRedis = async () => {
    try{
        await redisClient.connect();
        console.log("Redis connected Successfully");
    }
    catch(error){
        console.log("Redis connection failed" , error);
    }
}

module.exports = {
    redisClient,
    connectRedis
}
