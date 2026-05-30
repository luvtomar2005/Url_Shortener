require("dotenv").config({ override: true });

const { createApp } = require("./app");
const { loadEnv } = require("./config/env");
const { connectMongo } = require("./config/mongo");

const {
    connectRedis,
    redisClient
} = require("./config/redis");

async function main() {

    const env = loadEnv();

    await connectMongo(env.MONGODB_URI);

    await connectRedis();

   

    const app = createApp();

    app.listen(env.PORT, () => {
       
    });
}

main().catch((err) => {

     console.log("Startup error:", err);

    process.exit(1);
});