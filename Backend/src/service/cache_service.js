const { redisClient } = require( "../config/redis" );
class CachceService{
    async get(key){
        try{
            const data = await redisClient.get(key);
            if(!data){
                return null;
            }
            return JSON.parse(data);
        }
        catch(error){
            console.log("Redis Get Error:", error.message);

            return null;
        }

    }
    async set(key , value , ttl = 3600){
        try{
            await redisClient.set(
                key,
                JSON.stringify(value),
                {
                EX : ttl
            }
            )
            return true;
        }
        catch(error){
            console.log("Redis Set Error" , error.message);

            return false;
        }

    }
    async del(key){
        try{
            await redisClient.del(key);
            return true;
        }
        catch(error){
            console.log("Redis Delete Error:" , error.message);

            return false;
        }
    }
}

module.exports = new CachceService();


