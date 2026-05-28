import redisClient from "../config/redis";
import logger from "../utils/logger.js";

export const getCache = async (key) => {
    try{
        const data = await redisClient.get(key);

        if(data){
            logger.info(`Cache Hit : {key}`);
            return JSON.parse(data);
        }
        logger.info(`Cache Miss : {key}`);
        return null;
    }
    catch(error){
        logger.error(`Redis Get Failed : ${error.message}`);

        return null;
    }
}
export const setCache = async (key , value , ttl = 3600) => {
    try{
        await redisClient.set(
            key,
            JSON.stringify(value),
            {
                EX : ttl
            }
        );
    }
    catch(error){
        logger.error(`Redis Set failed : ${error.message}`);
    }
}
