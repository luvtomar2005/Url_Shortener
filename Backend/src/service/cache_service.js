const { redisClient } = require("../config/redis");

const withTimeout = async (promise, timeoutMs = 100) => {
    return Promise.race([
        promise,

        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Redis operation timeout"));
            }, timeoutMs);
        }),
    ]);
};

class CacheService {
    async get(key) {
        try {
            const data = await withTimeout(
                redisClient.get(key)
            );

            if (!data) {
                return null;
            }

            return JSON.parse(data);
        } catch (error) {
            console.log("Redis Get Error:", error.message);

            return null;
        }
    }

    async set(key, value, ttl = 3600) {
        try {
            await withTimeout(
                redisClient.set(
                    key,
                    JSON.stringify(value),
                    {
                        EX: ttl,
                    }
                )
            );

            return true;
        } catch (error) {
            console.log("Redis Set Error:", error.message);

            return false;
        }
    }

    async del(key) {
        try {
            await withTimeout(
                redisClient.del(key)
            );

            return true;
        } catch (error) {
            console.log("Redis Delete Error:", error.message);

            return false;
        }
    }
}

module.exports = new CacheService();