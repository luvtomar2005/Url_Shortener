require("dotenv").config({ override: true });
  
const { createApp } = require("./app");
const { loadEnv }  = require("./config/env");
const { connectMongo } = require("./config/mongo");

async function main(){
    const env = loadEnv();
    await connectMongo(env.MONGODB_URI);

    const app = createApp();
    app.listen(env.PORT , () => {
        console.log(`Server is running on port ${env.PORT}`);
    })
}

main().catch((err) => {
    console.log("Startup error:  " , err);
    process.exit(1);
})

